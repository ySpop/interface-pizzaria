import { formatDateInput } from "/scripts/formData.js";
import { getFuncionariosNames } from "/scripts/formData.js";

document.addEventListener("DOMContentLoaded", () => {
  const btnMenu = document.querySelector(".btn-menu");
  const menuOptionsHolder = document.querySelector(".menu-opcoes-holder");
  const menuOptionsContent = document.querySelector(".menu-opcoes-content");
  const comandaContent = document.querySelector(".comanda-content");
  const addProductDBContent = document.querySelector(".add-product-content");
  const fechamentoContainer = document.querySelector(
    ".fechamento-container-all"
  );
  const paymentsTableContent = document.querySelector(
    ".tabela-pagamentos-content"
  );
  const addAccountContent = document.querySelector(".addaccount-content");

  menuOptionsHolder.classList.remove("activeHolder");
  menuOptionsHolder.classList.remove("closeHolderTransition");
  comandaContent.classList.remove("active");
  addProductDBContent.classList.remove("active");
  fechamentoContainer.classList.remove("active");
  paymentsTableContent.classList.remove("active");
  addAccountContent.classList.remove("active");

  toggleModal();

  const btnAddItem = document.querySelector(".btn-add-item");
  const btnResetForm = document.querySelector(".btn-reset-form");
  const btnResetProductForm = document.querySelector(".btn-reset-product-form");
  const btnFechamentoResetForm = document.querySelector(
    ".fechamento-clear-btn"
  );
  const btnSendForm = document.getElementById("btn-send-form");
  const btnDeleteItem = document.getElementById("btn-delete-last-item");

  btnAddItem.addEventListener("click", (event) => {
    event.preventDefault();

    console.log("Botão AddItem clicado");
    addItemToContainer();
  });

  btnResetForm.addEventListener("click", (event) => {
    event.preventDefault();
    resetModal();
    console.log("Botão Apagar clicado");
  });

  btnFechamentoResetForm.addEventListener("click", (event) => {
    event.preventDefault();
    resetModal();
    console.log("Botão Apagar clicado");
  });

  btnDeleteItem.addEventListener("click", (event) => {
    event.preventDefault();

    removeItemFromContainer();

    console.log("Botão Retroceder clicado");
  });

  const addPaymentButton = document.querySelector(
    ".pagamento-bottom-adicionar"
  );
  if (addPaymentButton) {
    addPaymentButton.addEventListener("click", addItemFuncionarios);
  } else {
    console.log("Botão de adicionar pagamento não encontrado");
  }

  function addItemToContainer() {
    const inputsItemsContainer = document.querySelector(
      ".inputs-container-item"
    );
    const inputsItemQuantityContainer = document.querySelector(
      ".inputs-container-quantity"
    );

    const itemInput = document.createElement("input");
    const itemInputQuantity = document.createElement("input");

    itemInput.setAttribute("placeholder", "Digite o item");
    itemInput.setAttribute("type", "text");
    itemInput.setAttribute("name", "product-name");
    itemInput.classList.add("product-comanda-input");

    itemInputQuantity.setAttribute("placeholder", "Digite a quantidade");
    itemInputQuantity.setAttribute("type", "number");
    itemInputQuantity.setAttribute("name", "quantity");

    inputsItemsContainer.appendChild(itemInput);
    inputsItemQuantityContainer.appendChild(itemInputQuantity);
  }
});

function toggleModal() {
  const btnMenu = document.querySelector(".btn-menu");
  const menuOptionsHolder = document.querySelector(".menu-opcoes-holder");
  const menuOptionsContent = document.querySelector(".menu-opcoes-content");
  const btnOptionsCloser = document.querySelector(".btn-close-menu");
  const btnComanda = document.querySelector(".btn-comanda");
  const btnAddProductDB = document.querySelector(".btn-newproductdb");
  const btnFechamento = document.querySelector(".btn-fechamento");
  const btnPayments = document.querySelector(".btn-payments");
  const btnAddAccount = document.querySelector(".btn-addaccount");
  const comandaContent = document.querySelector(".comanda-content");
  const addProductDBContent = document.querySelector(".add-product-content");
  const fechamentoContainer = document.querySelector(
    ".fechamento-container-all"
  );
  const paymentsTableContent = document.querySelector(
    ".tabela-pagamentos-content"
  );
  const addAccountContent = document.querySelector(".addaccount-content");
  const body = document.querySelector(".body");

  function modalCloser() {
    setTimeout(() => {
      menuOptionsHolder.classList.add("closeHolderTransition");
      console.log(menuOptionsHolder);
    }, 300);

    setTimeout(() => {
      menuOptionsHolder.classList.remove("closeHolderTransition");
      menuOptionsHolder.classList.remove("activeHolder");
      console.log(menuOptionsHolder);
    }, 350);
  }

  btnMenu.addEventListener("click", () => {
    menuOptionsHolder.classList.add("activeHolder");
    body.style.overflow = "hidden";
  });

  btnOptionsCloser.addEventListener("click", () => {
    body.style.overflow = "auto";
    body.style.overflowX = "hidden";

    modalCloser();
  });

  btnComanda.addEventListener("click", () => {
    modalCloser();
    closeOtherOptions();

    console.log("Executada!");

    comandaContent.classList.add("active");
    body.style.overflow = "auto";

    console.log(comandaContent);
  });

  btnAddProductDB.addEventListener("click", () => {
    modalCloser();
    closeOtherOptions();

    console.log("Executada!");

    addProductDBContent.classList.add("active");
    body.style.overflow = "auto";

    console.log(body);
  });

  btnFechamento.addEventListener("click", () => {
    modalCloser();
    closeOtherOptions();

    console.log("Executada!");

    fechamentoContainer.classList.add("active");
    body.style.overflow = "auto";

    console.log(body);
  });

  btnPayments.addEventListener("click", () => {
    modalCloser();
    closeOtherOptions();

    console.log("Executada!");

    paymentsTableContent.classList.add("active");
    body.style.overflow = "auto";

    console.log(body);
  });

  btnAddAccount.addEventListener("click", () => {
    modalCloser();
    closeOtherOptions();

    console.log("Executada");

    addAccountContent.classList.add("active");
    body.style.overflow = "auto";

    console.log(body);
  });

  console.log("Função toggleModal executada");
}

function closeOtherOptions() {
  const comandaContent = document.querySelector(".comanda-content");
  const addProductDBContent = document.querySelector(".add-product-content");
  const fechamentoContainer = document.querySelector(
    ".fechamento-container-all"
  );
  const paymentsTableContent = document.querySelector(
    ".tabela-pagamentos-content"
  );
  const addAccountContent = document.querySelector(".addaccount-content");

  comandaContent.classList.remove("active");
  addProductDBContent.classList.remove("active");
  fechamentoContainer.classList.remove("active");
  paymentsTableContent.classList.remove("active");
  addAccountContent.classList.remove("active");
}

function addItemToContainer() {
  const inputsItemsContainer = document.querySelector(".inputs-container-item");
  const inputsItemQuantityContainer = document.querySelector(
    ".inputs-container-quantity"
  );

  const itemInput = document.createElement("input");
  const itemInputQuantity = document.createElement("input");

  itemInput.setAttribute("placeholder", "Digite o item");
  itemInput.setAttribute("type", "text");
  itemInput.classList.add("product-comanda-input");

  itemInputQuantity.setAttribute("placeholder", "Digite a quantidade");
  itemInputQuantity.setAttribute("type", "number");

  inputsItemsContainer.appendChild(itemInput);
  inputsItemQuantityContainer.appendChild(itemInputQuantity);
}

function removeItemFromContainer() {
  const inputsItemsContainer = document.querySelector(".inputs-container-item");
  const inputsItemQuantityContainer = document.querySelector(
    ".inputs-container-quantity"
  );

  if (inputsItemsContainer.lastElementChild) {
    inputsItemsContainer.removeChild(inputsItemsContainer.lastElementChild);
  }

  if (inputsItemQuantityContainer.lastElementChild) {
    inputsItemQuantityContainer.removeChild(
      inputsItemQuantityContainer.lastElementChild
    );
  }
}

function resetModal() {
  const comandaForm = document.querySelector(".comanda-form");
  const addProductDBForm = document.querySelector(".add-product-form");
  const fechamentoForm = document.getElementById("fechamento-form");

  addProductDBForm.reset();
  comandaForm.reset();
  fechamentoForm.reset();

  const inputsItemsContainer = document.querySelector(".inputs-container-item");
  const inputsItemQuantityContainer = document.querySelector(
    ".inputs-container-quantity"
  );

  while (inputsItemsContainer.firstChild) {
    inputsItemsContainer.removeChild(inputsItemsContainer.firstChild);
  }
  while (inputsItemQuantityContainer.firstChild) {
    inputsItemQuantityContainer.removeChild(
      inputsItemQuantityContainer.firstChild
    );
  }
}

function addItemFuncionarios(e) {
  e.preventDefault();

  const funcionariosHolder = document.querySelector(
    ".funcionarios-group-holder"
  );
  const funcionariosLine = document.createElement("hr");
  const funcionariosGroup = document.createElement("div");
  const funcionarioSelector = document.createElement("select");
  const inputData = document.createElement("input");
  const inputPagamento = document.createElement("input");
  const inputDescricao = document.createElement("input");
  const deleteItemIcon = document.createElement("img");
  const selectAccountFuncionario = document.createElement("select");

  selectAccountFuncionario.classList.add("funcionario-account-selector");
  selectAccountFuncionario.setAttribute("name", "funcionario-account");
  selectAccountFuncionario.setAttribute("required", true);

  deleteItemIcon.classList.add("trash-pagamento-icon");
  deleteItemIcon.src =
    "/assets/icons/delete_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg";

  funcionariosGroup.appendChild(funcionariosLine);
  funcionariosLine.classList.add("funcionarios-line");
  funcionariosGroup.appendChild(deleteItemIcon);
  funcionariosHolder.appendChild(funcionariosGroup);
  funcionariosGroup.classList.add("funcionario-group");
  funcionariosGroup.appendChild(funcionarioSelector);
  funcionarioSelector.classList.add("funcionario-selector");
  funcionariosGroup.appendChild(inputData);
  inputData.classList.add("input-funcionario-data");
  funcionariosGroup.appendChild(inputPagamento);
  inputPagamento.classList.add("input-funcionario-pagamento");
  funcionariosGroup.appendChild(inputDescricao);
  inputDescricao.classList.add("input-funcioario-descricao");
  funcionariosGroup.appendChild(selectAccountFuncionario);

  funcionarioSelector.setAttribute("name", "funcionario-id");
  funcionarioSelector.setAttribute("required", true);

  inputData.setAttribute("type", "text");
  inputData.setAttribute("placeholder", "Data");
  inputData.setAttribute("maxlength", "10");
  inputData.addEventListener("input", formatDateInput);

  inputPagamento.setAttribute("type", "number");
  inputPagamento.setAttribute("placeholder", "Pagamento");
  inputPagamento.setAttribute("step", 0.01);
  inputPagamento.setAttribute("min", 0);

  inputDescricao.setAttribute("type", "text");
  inputDescricao.setAttribute("placeholder", "Descrição");

  addDeleteEventListeners();
}

export function addDeleteEventListeners() {
  const deleteIcons = document.querySelectorAll(".trash-pagamento-icon");

  deleteIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const groupContainer = this.closest(".funcionario-group");
      if (groupContainer) {
        groupContainer.remove();
      }
    });
  });
}

export function paymentsSearchBar() {
  const searchBar = document.getElementById("search-bar");
  const tabela = document.getElementById("tbody-pagamentos-table");
  const noResultsMessage = document.getElementById("no-results-message");

  if (searchBar) {
    searchBar.addEventListener("input", () => {
      const filter = searchBar.value.toLowerCase();
      const rows = tabela.getElementsByTagName("tr");
      let hasResults = false;

      for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");
        let match = false;

        for (let j = 0; j < cells.length; j++) {
          if (cells[j]) {
            const cellValue = cells[j].textContent || cells[j].innerText;
            if (cellValue.toLowerCase().indexOf(filter) > -1) {
              match = true;
              break;
            }
          }
        }

        if (match) {
          rows[i].classList.remove("fade-out");
          rows[i].classList.add("fade-in");
          rows[i].style.display = "";
          hasResults = true;
        } else {
          rows[i].classList.remove("fade-in");
          rows[i].classList.add("fade-out");
          setTimeout(() => {
            rows[i].style.display = "none";
          }, 200);
        }
      }

      if (hasResults) {
        noResultsMessage.style.display = "none";
      } else {
        noResultsMessage.style.display = "block";
      }
    });
  } else {
    console.log("searchBar não encontrada!");
  }
}
