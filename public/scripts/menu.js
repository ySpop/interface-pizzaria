import { formatDateInput } from '/scripts/formData.js';

document.addEventListener("DOMContentLoaded", () => {
  const btnMenu = document.querySelector(".btn-menu");
  const menuOptionsHolder = document.querySelector(".menu-opcoes-holder");
  const menuOptionsContent = document.querySelector(".menu-opcoes-content");
  const comandaContent = document.querySelector(".comanda-content");
  const addProductDBContent = document.querySelector(".add-product-content");
  const fechamentoContainer = document.querySelector(
    ".fechamento-container-all"
  );
  const paymentsTableContent = document.querySelector(".tabela-pagamentos-content");

  menuOptionsHolder.classList.remove("activeHolder");
  menuOptionsHolder.classList.remove("closeHolderTransition");
  comandaContent.classList.remove("active");
  addProductDBContent.classList.remove("active");
  fechamentoContainer.classList.remove("active");
  paymentsTableContent.classList.remove("active");

  toggleModal();

  const btnAddItem = document.querySelector(".btn-add-item");
  const btnResetForm = document.querySelector(".btn-reset-form");
  const btnResetProductForm = document.querySelector(".btn-reset-product-form");
  const btnFechamentoResetForm = document.querySelector(".fechamento-clear-btn");
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
    event.preventDefault()
    resetModal()
    console.log("Botão Apagar clicado");
  });

  btnDeleteItem.addEventListener("click", (event) => {
    event.preventDefault();

    removeItemFromContainer();

    console.log("Botão Retroceder clicado");
  });

  const addPaymentButton = document.querySelector(".pagamento-bottom-adicionar");
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
  const comandaContent = document.querySelector(".comanda-content");
  const addProductDBContent = document.querySelector(".add-product-content");
  const fechamentoContainer = document.querySelector(
    ".fechamento-container-all"
  );
  const paymentsTableContent = document.querySelector(".tabela-pagamentos-content");
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

  console.log("Função toggleModal executada");
}

function closeOtherOptions() {
  const comandaContent = document.querySelector(".comanda-content");
  const addProductDBContent = document.querySelector(".add-product-content");
  const fechamentoContainer = document.querySelector(
    ".fechamento-container-all"
  );
  const paymentsTableContent = document.querySelector(".tabela-pagamentos-content");

  comandaContent.classList.remove("active");
  addProductDBContent.classList.remove("active");
  fechamentoContainer.classList.remove("active")
  paymentsTableContent.classList.remove("active");
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
  addProductDBForm.reset();
  comandaForm.reset();

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

  funcionariosHolder.appendChild(funcionariosLine);
  funcionariosLine.classList.add("funcionarios-line");
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

  funcionarioSelector.setAttribute("name", "funcionario-id");
  funcionarioSelector.setAttribute("required", true);

  inputData.setAttribute("type", "text");
  inputData.setAttribute("placeholder", "Data");
  inputData.setAttribute("maxlength", "10");
  inputData.addEventListener("input", formatDateInput);

  inputPagamento.setAttribute("type", "number");
  inputPagamento.setAttribute("placeholder", "Pagamento");
  inputPagamento.setAttribute("step", 0.01);
  inputPagamento.setAttribute("min", 0)

  inputDescricao.setAttribute("type", "text");
  inputDescricao.setAttribute("placeholder", "Descrição");
}
