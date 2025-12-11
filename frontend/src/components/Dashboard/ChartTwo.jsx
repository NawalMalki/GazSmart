// import React from 'react';

// const SalesCategory = () => {
//   const categories = [
//     { name: 'Chauffage ', percentage: 48, products: '53.2 kWh', color: 'bg-blue-500' },
//     { name: ' Eau chaude sanitaire', percentage: 33, products: '15.2 kWh', color: 'bg-green-500' },
//     { name: 'Cuisson', percentage: 19, products: '24.2 kWh ', color: 'bg-orange-500' }
//   ];

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//       <h3 className="text-lg font-semibold text-gray-800 mb-6">Sales Category</h3>
      
//       {/* Total */}
//       <div className="text-center mb-8">
//         <p className="text-3xl font-bold text-gray-800">2450</p>
//         <p className="text-sm text-gray-500">Total</p>
//       </div>

//       {/* Categories */}
//       <div className="space-y-4">
//         {categories.map((category, index) => (
//           <div key={index} className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className={`w-3 h-3 ${category.color} rounded-full`}></div>
//               <div>
//                 <p className="text-sm font-medium text-gray-800">{category.name}</p>
//                 <p className="text-xs text-gray-500">{category.products}</p>
//               </div>
//             </div>
//             <span className="text-sm font-semibold text-gray-800">
//               {category.percentage}%
//             </span>
//           </div>
//         ))}
//       </div>

//       {/* Progress Bars */}
//       <div className="mt-6 space-y-3">
//         {categories.map((category, index) => (
//           <div key={index}>
//             <div className="flex justify-between text-xs mb-1">
//               <span className="text-gray-600">{category.name}</span>
//               <span className="text-gray-600">{category.percentage}%</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className={`h-2 rounded-full ${category.color}`}
//                 style={{ width: `${category.percentage}%` }}
//               ></div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SalesCategory;