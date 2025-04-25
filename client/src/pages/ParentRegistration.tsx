// import { Link, useNavigate } from 'react-router-dom';
// import React, { useState } from 'react';

// // export default function KidsReg() {
// //   return (
// //     <div>
// //       <Link to="/kidsRegister">Kids Register</Link>
// //     </div>
// //   );
// // }

// export function ParentRegForm() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     parentName: '',
//     userName: '',
//     hashedPassword: '',
//   });

//   // function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//   //   const { name, value } = e.target;
//   //   setForm({ ...form, [name]: value });
//   // }

//   // async function handleSubmit(event: React.FormEvent) {
//   //   event.preventDefault();
//   //   try {
//   //     // FOR CONTINUATION
//   //   } catch (err) {
//   //     console.error(err);
//   //     alert(`Error adding or updating entry: ` + String(err));
//   //   }
//   // }

//   return (
//     <>
//       <div>
//         <h1>Register</h1>
//         <label>Parent Name / Guardian: </label>
//         <input type="text" name="parentName"></input>
//       </div>
//       <div>
//         <label>Username: </label>
//         <input type="text" name="username"></input>
//       </div>
//       <div>
//         <label>Password: </label>
//         <input type="text" name="password"></input>
//       </div>
//       <div>
//         <button>Register</button>
//         <button>Home</button>
//       </div>
//     </>
//   );
// }
