const fs = require('fs');
const content = fs.readFileSync('src/screens/admin/AdminEditProduct.jsx', 'utf8');

const extractBlock = (startComment, endComment) => {
  const startIdx = content.indexOf(startComment);
  if (startIdx === -1) throw new Error('Not found: ' + startComment);
  
  let endIdx = content.length;
  if (endComment) {
    endIdx = content.indexOf(endComment, startIdx);
    if (endIdx === -1) throw new Error('End not found: ' + endComment);
  }
  return content.slice(startIdx, endIdx);
};

try {
  const preReturn = content.slice(0, content.indexOf('return ('));
  
  const header = extractBlock('        {/* Header */}', '        <div className="max-w-7xl mx-auto">');
  const basicDetails = extractBlock('              {/* Basic Details */}', '              {/* Cinematic Storytelling Content */}');
  const cinematic = extractBlock('              {/* Cinematic Storytelling Content */}', '              {/* Product Variations */}');
  const variations = extractBlock('              {/* Product Variations */}', '              {/* Product Media (Images and Videos) */}');
  const media = extractBlock('              {/* Product Media (Images and Videos) */}', '            </div>\n            \n            <div className="space-y-8">');
  
  const pricing = extractBlock('            {/* Pricing & Organization Sidebar */}', '\n          </div>\n        </div>\n      </>\n      )}\n    </div>\n  );\n}');

  const btnMatch = header.match(/<button \s*onClick=\{handleSubmit\}[\s\S]*?<\/button>/);
  const saveBtn = btnMatch ? btnMatch[0] : '';
  const headerWithoutSave = header.replace(saveBtn, '').replace('<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">', '<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">\n          {/* Save button moved */}');

  const newReturn = `return (
    <div className="bg-[#FDFBF7] min-h-screen text-[#1A0A08] p-6 lg:p-10 font-sans pb-24">
      {isLoading ? (
        <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1A0A08]"></div></div>
      ) : (
      <>
${headerWithoutSave}
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col xl:flex-row gap-8 items-start">
            
            {/* LEFT COLUMN: Media (takes more width on XL screens) */}
            <div className="w-full xl:w-[60%] space-y-8">
${media}
            </div>

            {/* RIGHT COLUMN: Sticky Details (takes less width) */}
            <div className="w-full xl:w-[40%] sticky top-8 space-y-8">
${basicDetails}
${pricing}
              <div className="bg-[#1A0A08] p-6 rounded-2xl shadow-xl border border-gray-100 sticky bottom-8 z-10 flex flex-col items-center mt-8 text-white">
                <h4 className="font-serif text-lg font-bold mb-4">Save Product Changes</h4>
                ${saveBtn.replace('bg-[#1A0A08]', 'bg-white').replace('text-white', 'text-[#1A0A08]').replace('hover:bg-[#3E2312]', 'hover:bg-gray-100').replace('px-8 py-3', 'w-full justify-center py-4 text-base')}
              </div>
            </div>
            
          </div>

          {/* BELOW FOLD (Full Width) */}
          <div className="mt-12 space-y-8 max-w-[1400px] mx-auto">
${variations}
${cinematic}
          </div>
        </div>
      </>
      )}
    </div>
  );
}`;

  fs.writeFileSync('src/screens/admin/AdminEditProduct.jsx', preReturn + newReturn);
  console.log('Successfully reorganized AdminEditProduct.jsx');
} catch(e) {
  console.error(e);
}
