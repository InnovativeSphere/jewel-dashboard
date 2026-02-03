// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchProjects,
//   updateProject,
//   deleteProject,
// } from "@/redux/slices/projectsSlice";
// import { RootState, AppDispatch } from "@/redux/store";
// import { Card } from "./Card";
// import Image from "next/image";
// import {
//   FaTimes,
//   FaChevronLeft,
//   FaChevronRight,
//   FaTrash,
//   FaEdit,
//   FaSave,
// } from "react-icons/fa";

// interface ProjectDetailsProps {
//   projectId: number;
//   onClose: () => void;
// }

// export default function ProjectDetails({
//   projectId,
//   onClose,
// }: ProjectDetailsProps) {
//   const dispatch = useDispatch<AppDispatch>();
//   const { projects, loading } = useSelector(
//     (state: RootState) => state.projects
//   );

//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isEditing, setIsEditing] = useState(false);

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     start_date: "",
//     end_date: "",
//   });

//   useEffect(() => {
//     if (!projects.length) dispatch(fetchProjects());
//   }, [dispatch, projects.length]);

//   const project = projects.find((p) => p.id === projectId);

//   useEffect(() => {
//     if (project) {
//       setForm({
//         title: project.title || "",
//         description: project.description || "",
//         start_date: project.start_date || "",
//         end_date: project.end_date || "",
//       });
//     }
//   }, [project]);

//   if (loading) return <p>Loading...</p>;
//   if (!project) return <p>Project not found.</p>;

//   const photos = project.photos.length
//     ? project.photos
//     : [{ photo_url: "/placeholder.png", type: "before" }];

//   const prevImage = () =>
//     setCurrentImageIndex((i) => (i === 0 ? photos.length - 1 : i - 1));

//   const nextImage = () =>
//     setCurrentImageIndex((i) =>
//       i === photos.length - 1 ? 0 : i + 1
//     );

//   const handleDelete = async () => {
//     if (!confirm("Delete this project permanently?")) return;
//     await dispatch(deleteProject(project.id));
//     onClose();
//   };

//   const handleSave = async () => {
//     await dispatch(
//       updateProject({
//         id: project.id,
//         updates: {
//           title: form.title,
//           description: form.description,
//           start_date: form.start_date,
//           end_date: form.end_date,
//         },
//       })
//     );
//     setIsEditing(false);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

//       <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden">

//         {/* ===== Header ===== */}
//         <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">

//           <div>
//             {isEditing ? (
//               <input
//                 value={form.title}
//                 onChange={(e) =>
//                   setForm({ ...form, title: e.target.value })
//                 }
//                 className="text-2xl font-bold border rounded px-2 py-1 w-full"
//               />
//             ) : (
//               <h2 className="text-2xl font-bold">{project.title}</h2>
//             )}
//           </div>

//           <div className="flex items-center gap-2">

//             {!isEditing && (
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
//               >
//                 <FaEdit /> Edit
//               </button>
//             )}

//             {isEditing && (
//               <button
//                 onClick={handleSave}
//                 className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
//               >
//                 <FaSave /> Save
//               </button>
//             )}

//             <button
//               onClick={handleDelete}
//               className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
//             >
//               <FaTrash /> Delete
//             </button>

//             <button
//               onClick={onClose}
//               className="ml-2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
//             >
//               <FaTimes />
//             </button>

//           </div>
//         </div>

//         {/* ===== Body ===== */}
//         <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

//           {/* Description */}
//           <div>
//             {isEditing ? (
//               <textarea
//                 value={form.description}
//                 onChange={(e) =>
//                   setForm({ ...form, description: e.target.value })
//                 }
//                 rows={4}
//                 className="w-full border rounded-lg p-3"
//               />
//             ) : (
//               <p className="text-gray-700">
//                 {project.description || "No description provided."}
//               </p>
//             )}
//           </div>

//           {/* Image Slider */}
//           <div className="relative h-64 rounded-xl overflow-hidden bg-gray-100">

//             <Image
//               src={photos[currentImageIndex].photo_url}
//               alt="project"
//               fill
//               className="object-contain"
//             />

//             {photos.length > 1 && (
//               <>
//                 <button
//                   onClick={prevImage}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
//                 >
//                   <FaChevronLeft />
//                 </button>

//                 <button
//                   onClick={nextImage}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
//                 >
//                   <FaChevronRight />
//                 </button>
//               </>
//             )}
//           </div>

//           {/* Supervisors */}
//           <Card>
//             <h3 className="font-semibold mb-2 text-lg">Supervisors</h3>
//             {project.supervisors.length ? (
//               <ul className="list-disc list-inside space-y-1">
//                 {project.supervisors.map((s) => (
//                   <li key={s.id}>
//                     {s.name} {s.role && `(${s.role})`}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-gray-500">None assigned</p>
//             )}
//           </Card>

//           {/* Volunteers */}
//           <Card>
//             <h3 className="font-semibold mb-2 text-lg">Volunteers</h3>
//             {project.volunteers.length ? (
//               <ul className="list-disc list-inside space-y-1">
//                 {project.volunteers.map((v) => (
//                   <li key={v.id}>
//                     {v.name} {v.role && `(${v.role})`}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-gray-500">None assigned</p>
//             )}
//           </Card>

//         </div>
//       </div>
//     </div>
//   );
// }
