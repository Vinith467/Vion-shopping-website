import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../services/supabaseClient';

const bodyTypeImages = {
  hourglass: '/images/body_hourglass_1785826886362.jpg',
  pear: '/images/body_pear_1785826895509.jpg',
  apple: '/images/body_apple_1785826904033.jpg',
  rectangle: '/images/body_rectangle_1785826928036.jpg',
  athletic: '/images/body_athletic_1785826937990.jpg',
  petite: '/images/body_petite_1785826948274.jpg',
};

const getBodyImage = (shape) => {
  const normalized = shape?.toLowerCase();
  return bodyTypeImages[normalized] || bodyTypeImages.hourglass;
};

const AppContext = createContext();

export function AppProvider({ children }) {
  // Global Auth State
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [session, setSession] = useState(null);
  const [selectedConsumerId, setSelectedConsumerId] = useState(null);

  // Global Profile State
  const [profile, setProfile] = useState(null);

  // Global Measurements State (for primary user)
  const [measurements, setMeasurements] = useState({
    height: '',
    heightUnit: 'cm',
    bodyShape: '',
  });

  // Global Members State
  const [members, setMembers] = useState([]);

  // Cart State
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('vion_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('vion_cart', JSON.stringify(cart));
  }, [cart]);
  // Per-Profile Wishlist State
  const [wishlists, setWishlists] = useState(() => {
    try {
      const saved = localStorage.getItem('vion_wishlists');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('vion_wishlists', JSON.stringify(wishlists));
  }, [wishlists]);

  // Expose the current primary member's wishlist for backwards compatibility
  const wishlist = selectedConsumerId ? (wishlists[selectedConsumerId] || []) : [];

  const toggleWishlist = (productId) => {
    if (!selectedConsumerId) {
      toast.error("Please select a profile first.");
      return;
    }
    setWishlists(prev => {
      const currentList = prev[selectedConsumerId] || [];
      if (currentList.includes(productId)) {
        toast.success("Outfit removed!");
        return { ...prev, [selectedConsumerId]: currentList.filter(id => id !== productId) };
      } else {
        toast.success("Outfit saved!");
        return { ...prev, [selectedConsumerId]: [...currentList, productId] };
      }
    });
  };

  const isInWishlist = (productId) => {
    if (!selectedConsumerId) return false;
    return (wishlists[selectedConsumerId] || []).includes(productId);
  };

  const addToCart = (product, size, variation = null, customMeasurements = null) => {
    setCart(prev => {
      // Also match by variation.id if variation exists
      const existing = prev.find(item => 
        item.product.id === product.id && 
        item.size === size && 
        (variation ? item.variation?.id === variation.id : true) &&
        (!customMeasurements && !item.customMeasurements) // Don't group custom measured items unless they are identically matched (for simplicity, we just don't group custom measured items)
      );
      if (existing && !customMeasurements) {
        return prev.map(item => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, size, variation, customMeasurements, quantity: 1, id: Date.now().toString() }];
    });
    toast.success("Added to bag!");
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) return removeFromCart(cartItemId);
    setCart(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const fetchUserData = async (currentSession) => {
    if (!currentSession) return;
    try {
      const userId = currentSession.user.id;
      
      // Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileData) {
        setProfile({
          firstName: profileData.full_name?.split(' ')[0] || '',
          lastName: profileData.full_name?.split(' ').slice(1).join(' ') || '',
          email: currentSession.user.email,
        });
      }

      // Fetch Consumers (Members)
      let { data: consumersData } = await supabase
        .from('consumers')
        .select('*')
        .eq('user_id', userId)
        .order('is_primary', { ascending: false });

      // If empty, wait a second and retry (in case the trigger is still running)
      if (!consumersData || consumersData.length === 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const retry = await supabase
          .from('consumers')
          .select('*')
          .eq('user_id', userId)
          .order('is_primary', { ascending: false });
        consumersData = retry.data;
      }

      if (consumersData && consumersData.length > 0) {
        // QUICK CLEANUP: If there are multiple consumers (due to race condition bugs), let's keep only the oldest primary one (the real one)
        if (consumersData.length > 1) {
          const primaryConsumers = consumersData.filter(c => c.is_primary).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
          if (primaryConsumers.length > 1) {
            // Keep the first one (oldest), delete the others (newer duplicates)
            const toDelete = primaryConsumers.slice(1);
            for (const c of toDelete) {
              await supabase.from('consumers').delete().eq('id', c.id);
            }
            // Remove them from local array too
            const deleteIds = new Set(toDelete.map(c => c.id));
            for (let i = consumersData.length - 1; i >= 0; i--) {
              if (deleteIds.has(consumersData[i].id)) {
                consumersData.splice(i, 1);
              }
            }
          }
        }

        const primary = consumersData.find(c => c.is_primary);
        if (primary) {
          // QUICK SYNC: If the old fallback created 'Hourglass' but the user actually selected something else in metadata, update it!
          const metadata = currentSession.user.user_metadata || {};
          if (metadata.body_shape && primary.body_shape === 'Hourglass' && metadata.body_shape !== 'Hourglass') {
            await supabase.from('consumers').update({
              body_shape: metadata.body_shape,
              height_cm: metadata.height_cm || primary.height_cm,
              age: metadata.age || primary.age
            }).eq('id', primary.id);
            primary.body_shape = metadata.body_shape;
            primary.height_cm = metadata.height_cm || primary.height_cm;
            primary.age = metadata.age || primary.age;
          }

          setSelectedConsumerId(primary.id);
          setMeasurements({
            height: primary.height_cm?.toString() || '',
            heightUnit: 'cm',
            bodyShape: primary.body_shape ? primary.body_shape.charAt(0).toUpperCase() + primary.body_shape.slice(1) : 'Hourglass',
          });

          // Wishlist Migration
          const oldWishlistRaw = localStorage.getItem('vion_wishlist');
          if (oldWishlistRaw) {
            try {
              const oldArr = JSON.parse(oldWishlistRaw);
              if (Array.isArray(oldArr) && oldArr.length > 0) {
                setWishlists(prev => {
                  if (!prev[primary.id]) {
                    return { ...prev, [primary.id]: oldArr };
                  }
                  return prev;
                });
              }
              localStorage.removeItem('vion_wishlist');
            } catch (e) {
              localStorage.removeItem('vion_wishlist');
            }
          }
        }
        
        const formattedMembers = consumersData.map(c => ({
          id: c.id,
          name: c.name,
          isPrimary: c.is_primary,
          age: c.age,
          gender: c.gender,
          height: c.measurements?.height_string || (c.height_cm ? `${c.height_cm} cm` : 'Not set'),
          bodyShape: c.body_shape ? c.body_shape.charAt(0).toUpperCase() + c.body_shape.slice(1) : 'Hourglass',
          skinTone: c.skin_tone,
          image: c.avatar_url || '',
          measurements: c.measurements || {},
        }));
        setMembers(formattedMembers);
      } else {
        // Fallback: If no consumer exists (e.g. trigger failed), create one using auth metadata!
        const metadata = currentSession.user.user_metadata || {};
        const fallbackName = profileData?.full_name || metadata.full_name || 'My Profile';
        
        const { data: newConsumer, error: insertError } = await supabase
          .from('consumers')
          .insert({
            user_id: userId,
            name: fallbackName,
            is_primary: true,
            age: metadata.age || 25,
            gender: metadata.gender || 'Female',
            height_cm: metadata.height_cm || 165,
            body_shape: metadata.body_shape || 'Hourglass',
            skin_tone: metadata.skin_tone || null
          })
          .select()
          .single();
          
        if (newConsumer) {
          setMembers([{
            id: newConsumer.id,
            name: newConsumer.name,
            isPrimary: true,
            age: newConsumer.age,
            gender: newConsumer.gender,
            height: newConsumer.measurements?.height_string || (newConsumer.height_cm ? `${newConsumer.height_cm} cm` : 'Not set'),
            bodyShape: newConsumer.body_shape ? newConsumer.body_shape.charAt(0).toUpperCase() + newConsumer.body_shape.slice(1) : 'Hourglass',
            skinTone: newConsumer.skin_tone,
            image: newConsumer.avatar_url || '',
            measurements: newConsumer.measurements || {},
          }]);
          setSelectedConsumerId(newConsumer.id);
          setMeasurements({
            height: newConsumer.height_cm?.toString() || '',
            heightUnit: 'cm',
            bodyShape: newConsumer.body_shape ? newConsumer.body_shape.charAt(0).toUpperCase() + newConsumer.body_shape.slice(1) : 'Hourglass',
          });
        } else {
          setMembers([]);
        }
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setIsLoggedIn(!!session);
      if (session) {
        await fetchUserData(session);
      }
      setIsInitialized(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setIsLoggedIn(!!session);
      if (session) {
        await fetchUserData(session);
        setIsInitialized(true);
      } else {
        setProfile(null);
        setMembers([]);
        setSelectedConsumerId(null);
        setIsInitialized(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  // Mock API Save Function
  const saveProfile = async (newProfile) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setProfile((prev) => ({ ...prev, ...newProfile }));
        toast.success('Profile updated successfully!');
        resolve();
      }, 800);
    });
  };

  const saveMeasurements = async (newMeasurements) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMeasurements((prev) => ({ ...prev, ...newMeasurements }));
        toast.success('Measurements saved successfully!');
        resolve();
      }, 800);
    });
  };

  const addMember = async (newMember) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not logged in');

      const heightVal = newMember.height;
      const isNumericHeight = heightVal && /^\d+$/.test(String(heightVal).trim());
      
      const { data: newConsumer, error } = await supabase
        .from('consumers')
        .insert({
          user_id: session.user.id,
          name: newMember.name,
          is_primary: false,
          age: parseInt(newMember.age) || null,
          gender: newMember.gender,
          height_cm: isNumericHeight ? parseInt(heightVal) : null,
          body_shape: newMember.bodyShape || null,
          avatar_url: newMember.avatarUrl || null,
          skin_tone: newMember.skinTone || null,
          measurements: { ...(newMember.measurements || {}), size: newMember.size, category: newMember.category, occasions: newMember.occasions, height_string: newMember.height },
        })
        .select()
        .single();

      if (error) throw error;

      if (newConsumer) {
        const memberToAdd = {
          id: newConsumer.id,
          name: newConsumer.name,
          isPrimary: false,
          age: newConsumer.age,
          gender: newConsumer.gender,
          height: newConsumer.measurements?.height_string || (newConsumer.height_cm ? `${newConsumer.height_cm} cm` : 'Not set'),
          bodyShape: newConsumer.body_shape ? newConsumer.body_shape.charAt(0).toUpperCase() + newConsumer.body_shape.slice(1) : 'Hourglass',
          skinTone: newConsumer.skin_tone,
          image: newConsumer.avatar_url || '',
          measurements: newConsumer.measurements || {},
        };
        setMembers((prev) => [...prev, memberToAdd]);
        toast.success(`${newConsumer.name} added successfully!`);
        return newConsumer.id;
      }
    } catch (err) {
      console.error('Error adding member:', err);
      toast.error('Failed to add member');
      return null;
    }
  };

  const updateMember = async (memberId, updatedMember) => {
    try {
      // Parse height_cm only if the height looks numeric (e.g. "165"), not a range string (e.g. "5'4\" - 5'7\"")
      const heightVal = updatedMember.height;
      const isNumericHeight = heightVal && /^\d+$/.test(String(heightVal).trim());
      
      const updates = {
        name: updatedMember.name,
        age: parseInt(updatedMember.age) || null,
        gender: updatedMember.gender,
        height_cm: isNumericHeight ? parseInt(heightVal) : null,
        body_shape: updatedMember.bodyShape || null,
        skin_tone: updatedMember.skinTone || null,
      };
      
      if (updatedMember.avatarUrl !== undefined) {
        updates.avatar_url = updatedMember.avatarUrl || null;
      }
      
      const currentMeasurements = updatedMember.measurements || {};
      updates.measurements = { 
        ...currentMeasurements, 
        size: updatedMember.size !== undefined ? updatedMember.size : currentMeasurements.size,
        category: updatedMember.category !== undefined ? updatedMember.category : currentMeasurements.category,
        occasions: updatedMember.occasions !== undefined ? updatedMember.occasions : currentMeasurements.occasions,
        height_string: updatedMember.height !== undefined ? updatedMember.height : currentMeasurements.height_string
      };

      const { error } = await supabase
        .from('consumers')
        .update(updates)
        .eq('id', memberId);

      if (error) throw error;

      setMembers((prev) => prev.map(m => m.id === memberId ? {
        ...m,
        name: updatedMember.name,
        age: parseInt(updatedMember.age) || null,
        gender: updatedMember.gender,
        height: updatedMember.height !== undefined ? updatedMember.height : m.height,
        bodyShape: updatedMember.bodyShape || m.bodyShape,
        skinTone: updatedMember.skinTone !== undefined ? updatedMember.skinTone : m.skinTone,
        image: updatedMember.avatarUrl !== undefined ? (updatedMember.avatarUrl || '') : m.image,
        measurements: updates.measurements,
      } : m));
      toast.success('Member updated successfully!');
    } catch (err) {
      console.error('Error updating member:', err);
      toast.error('Failed to update member');
      throw err;
    }
  };

  const deleteMember = async (memberId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not logged in');

      const { error } = await supabase
        .from('consumers')
        .delete()
        .eq('id', memberId)
        .eq('user_id', session.user.id);

      if (error) throw error;

      setMembers((prev) => prev.filter(m => m.id !== memberId));
      toast.success('Member removed successfully!');
      
      if (selectedConsumerId === memberId) {
        const primary = members.find(m => m.isPrimary);
        if (primary) setSelectedConsumerId(primary.id);
      }
    } catch (err) {
      console.error('Error deleting member:', err);
      toast.error('Failed to remove member');
      throw err;
    }
  };

  const setPrimaryMember = async (memberId) => {
    if (!session?.user?.id) return;
    try {
      const userId = session.user.id;
      // Set all consumers to non-primary
      await supabase.from('consumers').update({ is_primary: false }).eq('user_id', userId);
      // Set the selected one to primary
      await supabase.from('consumers').update({ is_primary: true }).eq('id', memberId);
      
      // Refresh user data to sync state
      await fetchUserData(session);
      toast.success("Primary profile updated!");
    } catch (err) {
      toast.error("Failed to switch profile");
    }
  };

  const updateMemberImage = async (memberId, imageUrl) => {
    setMembers((prev) => 
      prev.map((m) => 
        m.id === memberId ? { ...m, image: imageUrl } : m
      )
    );
  };

  const updateMemberVtonImage = async (memberId, base64Image) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMembers((prev) => 
          prev.map((m) => 
            m.id === memberId ? { ...m, vtonImage: base64Image } : m
          )
        );
        toast.success('Virtual Try-On photo saved!');
        resolve();
      }, 500);
    });
  };

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setSelectedConsumerId(null);
  };

  return (
    <AppContext.Provider value={{
      isInitialized,
      isLoggedIn,
      session,
      selectedConsumerId,
      setSelectedConsumerId,
      login,
      logout,
      profile,
      measurements,
      members,
      saveProfile,
      saveMeasurements,
      addMember,
      updateMember,
      deleteMember,
      setPrimaryMember,
      updateMemberImage,
      updateMemberVtonImage,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      wishlist,
      toggleWishlist,
      isInWishlist
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
