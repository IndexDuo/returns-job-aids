// import React, { useState, useEffect } from "react";
// import emailTemplates from "../emailTemplates.json";

// const EmailTemplateLists = ({ onSelectTemplate }) => {
//     const [templates, setTemplates] = useState([]);

//     useEffect(() => {
//         // setTemplates(emailTemplates);
//     }, []);
//     // console.log(templates[0].name);

//     return (
//         <div>
//             <h4>Select an Email Template</h4>
//             <ul>
//                 {templates.map((template) => (
//                     <li key={template.id}>
//                         <button onClick={() => onSelectTemplate(template)}>
//                             {template.name}
//                         </button>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default EmailTemplateLists;
