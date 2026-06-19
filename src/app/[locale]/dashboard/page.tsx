// "use client";

// import Image from "next/image";
// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// export default function AnalysisPage() {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     setIsVisible(true);
//   }, []);


//   return (
//     <div className="relative w-full min-h-screen overflow-x-hidden overflow-y-auto bg-gradient-to-br from-white via-orange-50/30 to-white dark:from-black dark:via-gray-950 dark:to-black">
//       {/* Animated Background Elements - Orange Theme */}
//       <div className="absolute inset-0 overflow-hidden ">
//         <div className="absolute top-1/4 -left-48 w-96 h-96 bg-orange-500/10 dark:bg-orange-600/5 rounded-full blur-3xl animate-pulse"></div>
//         <div
//           className="absolute bottom-1/4 -right-48 w-96 h-96 bg-orange-400/10 dark:bg-orange-700/5 rounded-full blur-3xl animate-pulse"
//           style={{ animationDelay: "1s" }}
//         ></div>
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-500/5 to-orange-600/5 dark:from-orange-600/5 dark:to-orange-700/5 rounded-full blur-3xl"></div>
//       </div>

//       {/* Decorative Grid Pattern */}
//       <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

//       {/* Main Container */}
//       <div className="relative z-10 flex min-h-screen flex-col items-center justify-start px-4 py-14 sm:px-6 sm:py-16 lg:justify-center lg:px-8 max-w-7xl mx-auto">
//         {/* Logo Section with Enhanced Design */}
//         <div
//           className={`relative mb-12 transition-all duration-1000 ease-out ${
//             isVisible
//               ? "opacity-100 translate-y-0 scale-100"
//               : "opacity-0 translate-y-12 scale-95"
//           }`}
//         >
//           <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto group">
//             {/* Animated Orange Glow Effect */}
//             <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-orange-600/20 to-orange-700/20 dark:from-orange-600/10 dark:via-orange-700/10 dark:to-orange-800/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 animate-pulse"></div>

//             {/* Logo Container with Glassmorphism */}
//             <div className="absolute inset-0 bg-white/90 dark:bg-black/90 rounded-3xl backdrop-blur-xl border border-gray-200 dark:border-gray-800 shadow-2xl shadow-orange-500/10 dark:shadow-orange-900/20 group-hover:scale-105 transition-all duration-500">
//               <div className="w-full h-full flex items-center justify-center p-8">
//                 <div className="relative w-40 h-40 sm:w-48 sm:h-48 group-hover:scale-110 transition-transform duration-500">
//                   <Image
//                     src={"/logo.svg"}
//                     alt="Lista Stores Logo"
//                     fill
//                     priority
//                     className="object-contain drop-shadow-lg"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Decorative Orange Orbital Rings */}
//             <div className="absolute -inset-4 rounded-3xl border border-orange-300/30 dark:border-orange-600/20 group-hover:border-orange-400/50 dark:group-hover:border-orange-500/30 transition-colors duration-500"></div>
//             <div className="absolute -inset-6 rounded-3xl border border-orange-200/20 dark:border-orange-700/10 group-hover:border-orange-300/40 dark:group-hover:border-orange-600/20 transition-colors duration-500"></div>
//           </div>
//         </div>

//         {/* Brand Section with Enhanced Typography */}
//         <div
//           className={`text-center mb-8 transition-all duration-1000 delay-200 ease-out ${
//             isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
//           }`}
//         >
//           <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight bg-gradient-to-r from-black via-orange-600 to-orange-500 dark:from-white dark:via-orange-400 dark:to-orange-300 bg-clip-text text-transparent mb-6 font-sans">
//             Lista Stores
//           </h1>

//           <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-light tracking-wide mb-8 max-w-2xl mx-auto">
//             Master Dashboard
//           </p>

//           {/* Enhanced Separator with Orange Animation */}
//           <div className="relative w-32 h-1 mx-auto mb-8 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
//             <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 dark:from-orange-500 dark:via-orange-600 dark:to-orange-700 animate-shimmer"></div>
//           </div>
//         </div>

//         {/* Welcome Message with Badge */}
//         <div
//           className={`text-center transition-all duration-1000 delay-300 ease-out ${
//             isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
//           }`}
//         >
//           <Badge
//             variant="outline"
//             className="px-6 py-3 text-sm border-orange-200 dark:border-orange-800 bg-white/60 dark:bg-black/60 backdrop-blur-lg shadow-lg"
//           >
//             <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse mr-2"></div>
//             System Online & Ready
//           </Badge>
//         </div>

//         {/* Quick Stats Cards using shadcn Card */}
//         <div
//           className={`mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-3xl transition-all duration-1000 delay-400 ease-out ${
//             isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
//           }`}
//         >
//           {[
//             { label: "Products", icon: "📦", value: "Active" },
//             { label: "Orders", icon: "🛒", value: "Processing" },
//             { label: "Users", icon: "👥", value: "Online" },
//           ].map((item, idx) => (
//             <Card
//               key={idx}
//               className="group hover:shadow-xl hover:scale-105 transition-all duration-300 border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-lg hover:border-orange-300 dark:hover:border-orange-700"
//             >
//               <CardHeader className="pb-3">
//                 <div className="flex items-center justify-between">
//                   <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
//                     {item.icon}
//                   </div>
//                   <Badge
//                     variant="outline"
//                     className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-transparent"
//                   >
//                     {item.value}
//                   </Badge>
//                 </div>
//               </CardHeader>
//               <CardContent className="pt-0">
//                 <CardTitle className="text-base text-gray-700 dark:text-gray-300">
//                   {item.label}
//                 </CardTitle>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>

//       {/* Enhanced Corner Accents with Orange Animation */}
//       <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-orange-400/40 dark:border-orange-600/40 rounded-tl-lg transition-all duration-500 hover:w-16 hover:h-16 hover:border-orange-500/60 dark:hover:border-orange-500/60"></div>
//       <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-orange-400/40 dark:border-orange-600/40 rounded-tr-lg transition-all duration-500 hover:w-16 hover:h-16 hover:border-orange-500/60 dark:hover:border-orange-500/60"></div>
//       <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-orange-400/40 dark:border-orange-600/40 rounded-bl-lg transition-all duration-500 hover:w-16 hover:h-16 hover:border-orange-500/60 dark:hover:border-orange-500/60"></div>
//       <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-orange-400/40 dark:border-orange-600/40 rounded-br-lg transition-all duration-500 hover:w-16 hover:h-16 hover:border-orange-500/60 dark:hover:border-orange-500/60"></div>
//     </div>
//   );
// }

"use client";
import { Analysis } from "@/modules/analysis/components/analysis";

export default function HomePage() {

  return (
    <Analysis />
  );
}