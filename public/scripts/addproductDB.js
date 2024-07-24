// document.addEventListener("DOMContentLoaded", () => {
//     const btnSendForm = document.getElementById("btn-send-form");
  
//     btnSendForm.addEventListener("click", (event) => {
//       event.preventDefault();
//       captureFormData();
//     });
//   });
  
//   function captureFormData() {
//     const formData = new FormData(document.querySelector(".comanda-form"));
  
//     const formObject = {};
//     formData.forEach((value, key) => {
//       formObject[key] = value;
//     });
  
//     console.log(document.querySelector(".input-order-time").value);
  
//     console.log(formObject); // Verifique os dados capturados no console
  
//     // Envie os dados para o backend
//     fetch("http://localhost:3000/venda-submit", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(formObject),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Success:", data);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   }
  