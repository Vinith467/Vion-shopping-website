const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const env = fs.readFileSync('.env', 'utf8').split('\n').reduce((acc, line) => {
  const [k,v] = line.split('=');
  if (k&&v) acc[k.trim()] = v.trim();
  return acc;
}, {});
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const data = [
  { id: '15767e79-fccc-4b0f-b3e8-ebc850762d84', name: 'Smart Casual', slug: 'smart-casual___GENDER_women___BODYSHAPE_rectangle' },
  { id: '8ec766a5-670b-4770-9799-2096da761a0a', name: 'Business Suits', slug: 'business-suits___GENDER_women___BODYSHAPE_hourglass' },
  { id: '1f9836fb-919e-4ac4-bf4f-bf2fff489ea4', name: 'Formal Dresses', slug: 'formal-dresses___GENDER_women___BODYSHAPE_hourglass' },
  { id: '70c72a21-fb0a-4ee0-8678-d282857fd158', name: 'Smart Casual', slug: 'smart-casual___GENDER_women___BODYSHAPE_hourglass' },
  { id: '17ae0928-b1fb-4cd1-ab66-7281ab6798e2', name: 'Co-Ord Sets', slug: 'co-ord-sets___GENDER_women___BODYSHAPE_hourglass' },
  { id: '1c8a0fc2-db79-4970-9eef-25d2d5c4bd4f', name: 'Power Dressing', slug: 'power-dressing___GENDER_women___BODYSHAPE_hourglass' },
  { id: '138f25c5-5bf3-4749-8771-7f72609623a4', name: 'Co-Ord Sets', slug: 'co-ord-sets___GENDER_women___BODYSHAPE_rectangle' },
  { id: 'c81a80e4-4ddf-40f5-a04e-331a819125a7', name: 'Smart Top and Pants', slug: 'smart-top-and-pants___GENDER_women___BODYSHAPE_hourglass' },
  { id: '4d7598bf-131d-4708-9252-0779a81f4a88', name: 'Icons Only', slug: 'icons-only___GENDER_women___BODYSHAPE_hourglass' },
  { id: '3c1dedc6-6b54-4d25-a762-110b522fd80b', name: 'The Boss Lounge', slug: 'the-boss-lounge___GENDER_women___BODYSHAPE_hourglass' },
  { id: '0117d254-9367-4d3a-98b9-be42383afc06', name: 'The Boardroom Edit', slug: 'the-boardroom-edit___GENDER_women___BODYSHAPE_hourglass' },
  { id: 'ff7a00c4-f456-4a2c-9c23-456bd0af8f37', name: 'Regal Essence', slug: 'regal-essence___GENDER_women___BODYSHAPE_hourglass' },
  { id: '85e5b47f-2aff-4c97-b542-d3f3aa6888de', name: 'A-Line Mini Dress', slug: 'a-line-mini-work-dress___GENDER_women___BODYSHAPE_hourglass' },
  { id: '7a543777-3f3d-4cf7-9971-47b9ead18c8f', name: 'Business Suits', slug: 'business-suits___GENDER_women___BODYSHAPE_pear' },
  { id: '3e4ac35d-1fe8-4b4c-9ecc-8b339b3e029b', name: 'Formal Dresses', slug: 'formal-dresses___GENDER_women___BODYSHAPE_pear' },
  { id: '010a4b64-9d6f-4a81-89c3-0883f6dc44b8', name: 'Smart Casual', slug: 'smart-casual___GENDER_women___BODYSHAPE_pear' },
  { id: 'd6f66245-e76c-44ac-a52e-aa2430866a91', name: 'Co-Ord Sets', slug: 'co-ord-sets___GENDER_women___BODYSHAPE_pear' },
  { id: 'dee8d678-1283-4d6f-a4ff-725f5f6f96e2', name: 'Friday Office Wear', slug: 'friday-office-wear___GENDER_women___BODYSHAPE_hourglass' },
  { id: 'c84afbbf-35e8-45f5-8e41-89fc9a00f753', name: 'Power Dressing', slug: 'power-dressing___GENDER_women___BODYSHAPE_pear' },
  { id: 'c4fa53e9-6966-48a4-8150-8f976b9e33d1', name: 'A-Line Mini Dress', slug: 'a-line-mini-dress___GENDER_women___BODYSHAPE_pear' },
  { id: '8f46ddd4-4a30-4910-91a2-1ef72ffea935', name: 'Smart Top and Pants', slug: 'smart-top-and-pants___GENDER_women___BODYSHAPE_pear' },
  { id: 'a38b7bfe-1a8c-4b36-bfa1-690fef01d2e4', name: 'Icons Only', slug: 'icons-only___GENDER_women___BODYSHAPE_pear' },
  { id: '56b1f10d-015e-4d3b-a267-2f9fa1e76d0e', name: 'Friday Office Wear', slug: 'friday-office-wear___GENDER_women___BODYSHAPE_pear' },
  { id: '257b1632-a25f-445d-9a43-aae75e30aa0d', name: 'Regal Essence', slug: 'regal-essence___GENDER_women___BODYSHAPE_pear' },
  { id: '3cdd1c0b-d93c-4f6d-ae6b-0726d79286b6', name: 'The Boardroom Edit', slug: 'the-boardroom-edit___GENDER_women___BODYSHAPE_pear' },
  { id: 'aa7c5276-a905-41c3-a20e-9a1305645ed5', name: 'The Boss Lounge', slug: 'the-boss-lounge___GENDER_women___BODYSHAPE_pear' },
  { id: '718e1594-36f0-4df4-bfdf-db1473aa46c6', name: 'Business Suits', slug: 'business-suits___GENDER_women___BODYSHAPE_rectangle' },
  { id: 'e2ad0168-974c-4eaf-b23a-edacc0cbde8a', name: 'Formal Dresses', slug: 'formal-dresses___GENDER_women___BODYSHAPE_rectangle' },
  { id: 'fb201c52-bfe4-40e3-b56e-2f84e448c4d3', name: 'A-Line Mini Dress', slug: 'a-line-mini-dress___GENDER_women___BODYSHAPE_rectangle' },
  { id: 'cabf4245-6f65-4c2d-a6ae-9195b609e35b', name: 'Smart Top and Pants', slug: 'smart-top-and-pants___GENDER_women___BODYSHAPE_rectangle' },
  { id: '8e18a8d0-fc18-435f-9e4f-47415e26959c', name: 'Icons Only', slug: 'icons-only___GENDER_women___BODYSHAPE_rectangle' },
  { id: '7c779018-3112-4f68-8f2f-ebdf67897022', name: 'Power Dressing', slug: 'power-dressing___GENDER_women___BODYSHAPE_rectangle' },
  { id: 'af1b7d7f-f728-460a-a064-b518ac36a507', name: 'Friday Office Wear', slug: 'friday-office-wear___GENDER_women___BODYSHAPE_rectangle' },
  { id: '750dcc69-3826-439f-a991-8ceaf9d24298', name: 'Regal Essence', slug: 'regal-essence___GENDER_women___BODYSHAPE_rectangle' },
  { id: '6f3068ab-f452-415f-8542-a06af7342154', name: 'The Boss Lounge', slug: 'the-boss-lounge___GENDER_women___BODYSHAPE_rectangle' },
  { id: '80d314c7-13d5-4bf3-9021-5538654ea62e', name: 'The Boardroom Edit', slug: 'the-boardroom-edit___GENDER_women___BODYSHAPE_rectangle' },
  { id: '54d5bee5-94bf-4ccb-bfc0-3da6f7b40066', name: 'A-Line Mini Dress', slug: 'a-line-mini-dress___GENDER_women___BODYSHAPE_apple' },
  { id: 'da394da0-9f7b-4427-a811-4b5521db4d5e', name: 'Business Suits', slug: 'business-suits___GENDER_women___BODYSHAPE_apple' },
  { id: 'aa54dd03-fce1-4d82-8bae-2f35e66a38db', name: 'Co-Ord Sets', slug: 'co-ord-sets___GENDER_women___BODYSHAPE_apple' },
  { id: 'd7a49be1-f801-41f8-9428-14c5d0c6c7ad', name: 'Formal Dresses', slug: 'formal-dresses___GENDER_women___BODYSHAPE_apple' },
  { id: '2910e232-f66a-41f2-80e7-37aee631df2d', name: 'Friday Office Wear', slug: 'friday-office-wear___GENDER_women___BODYSHAPE_apple' },
  { id: 'be10313b-2169-4eae-b75b-868e70dd88d5', name: 'Icons Only', slug: 'icons-only___GENDER_women___BODYSHAPE_apple' },
  { id: '2b13e3d4-9c6f-4083-bfd7-1d64e24387ff', name: 'Power Dressing', slug: 'power-dressing___GENDER_women___BODYSHAPE_apple' },
  { id: '8329f821-433b-4e10-a69f-2ca458b8a324', name: 'Regal Essence', slug: 'regal-essence___GENDER_women___BODYSHAPE_apple' },
  { id: 'e793822a-1775-47be-8378-d4d52c0d69e3', name: 'Smart Top and Pants', slug: 'smart-top-and-pants___GENDER_women___BODYSHAPE_apple' },
  { id: '6bbf4ed1-e904-4fea-b756-6232fecbbcad', name: 'The Boardroom Edit', slug: 'the-boardroom-edit___GENDER_women___BODYSHAPE_apple' },
  { id: 'd41e67cd-d9ca-4a80-a55e-17142479a224', name: 'Smart Casual', slug: 'smart-casual___GENDER_women___BODYSHAPE_apple' },
  { id: '87787a95-f07c-40f8-b58a-ed66ce0a7159', name: 'The Boss Lounge', slug: 'the-boss-lounge___GENDER_women___BODYSHAPE_apple' }
];

async function run() {
  let count = 0;
  for (const cat of data) {
    const { error } = await supabase.from('categories').upsert(cat, { onConflict: 'id' });
    if (error) console.error(error);
    else count++;
  }
  console.log('Restored', count, 'categories.');
}
run();
