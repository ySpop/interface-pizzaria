const salesModalHolder = document.querySelector(".detalhes-vendas-container");
const closeModal = document.querySelector(".btn-close-sales-details");
const tabelaVendas = document.getElementById("tabela-vendas");
const btnSales = document.querySelector(".btn-sales");

document.addEventListener("DOMContentLoaded", () => {
  btnSales.addEventListener("click", () => {
    function handleTableClick(event) {
      console.log("Table clicked");
      const row = event.target.closest("tr");
      if (row && row.dataset.orderId) {
        const orderId = row.dataset.orderId;
        console.log("Order ID:", orderId);
        loadOrderDetails(orderId);
      }
    }

    async function loadOrderDetails(orderId) {
      const salesModalHolder = document.querySelector(
        ".detalhes-vendas-container"
      );
      if (salesModalHolder) {
        salesModalHolder.style.display = "block";
      } else {
        console.error(
          "Elemento com CLASSE 'detalhes-vendas-container' não encontrado."
        );
        return;
      }

      try {
        const response = await fetch(`/venda-detalhes/${orderId}`);
        const vendaDetalhes = await response.json();

        const detalhesBody = document.querySelector(
          ".tabela-sales-details-body"
        );
        if (!detalhesBody) {
          console.error(
            "Elemento com CLASSE 'tabela-sales-details-body' não encontrado."
          );
          return;
        }

        detalhesBody.innerHTML = "";

        const vendaRows = vendaDetalhes.items
          .map(
            (item) => `
          <tr>
            <td>${item.product_name || "Desconhecido"}</td>
            <td>${item.quantity || 0}</td>
            <td>R$ ${
              item.product_price ? item.product_price.toFixed(2) : "0.00"
            }</td>
          </tr>
        `
          )
          .join("");

        const meiaRows = vendaDetalhes.meiaItems
          .map(
            (item) => `
          <tr class="meia-row">
            <td class="meia-product-name-td">${
              item.product_name_1 || "Desconhecido"
            }</td>
            <td class="meia-product-quantity-td" rowspan="2">${
              item.quantity || 0
            }</td>
            <td>R$ ${
              item.product_price_1 ? item.product_price_1.toFixed(2) : "0.00"
            }</td>
          </tr>
          <tr class="meia-row">
            <td class="meia-product-name-td">${
              item.product_name_2 || "Desconhecido"
            }</td>
            <td>R$ ${
              item.product_price_2 ? item.product_price_2.toFixed(2) : "0.00"
            }</td>
          </tr>
        `
          )
          .join("");

        detalhesBody.innerHTML = vendaRows + meiaRows;
      } catch (error) {
        console.error("Erro ao buscar detalhes da venda:", error);
        alert("Erro ao carregar os detalhes da venda.");
      }

      console.log("Executada");
    }

    tabelaVendas.addEventListener("click", handleTableClick);
  });
});

closeModal.addEventListener("click", () => {
  salesModalHolder.style.display = "none";
});

window.onclick = (event) => {
  if (event.target == salesModalHolder) {
    salesModalHolder.style.display = "none";
  }
};
