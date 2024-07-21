document.addEventListener("DOMContentLoaded", () => {
  const btnMenu = document.querySelector(".btn-menu");
  const menuOptionsHolder = document.querySelector(".menu-opcoes-holder");
  const menuOptionsContent = document.querySelector(".menu-opcoes-content");
  const comandaContent = document.querySelector(".comanda-content");

  menuOptionsHolder.classList.remove("activeHolder");
  menuOptionsHolder.classList.remove("closeHolderTransition");
  comandaContent.classList.remove("activeComanda");

  toggleModal();

  const btnAddItem = document.querySelector(".btn-add-item");
  const btnResetForm = document.getElementById("btn-reset-form");
  const btnSendForm = document.getElementById("btn-send-form");
  const btnDeleteItem = document.getElementById("btn-delete-last-item");

  btnAddItem.addEventListener("click", (event) => {
    event.preventDefault();

    addItemToContainer();
    console.log("Botão Adicionar Item clicado");
  });

  btnResetForm.addEventListener("click", (event) => {
    event.preventDefault();
    resetModal();
    console.log("Botão Apagar clicado");
  });

  btnSendForm.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("Botão Enviar clicado");
  });

  btnDeleteItem.addEventListener("click", (event) => {
    event.preventDefault();

    removeItemFromContainer();

    console.log("Botão Retroceder clicado");
  });
});

function toggleModal() {
  const btnMenu = document.querySelector(".btn-menu");
  const menuOptionsHolder = document.querySelector(".menu-opcoes-holder");
  const menuOptionsContent = document.querySelector(".menu-opcoes-content");
  const btnOptionsCloser = document.querySelector(".btn-close-menu");
  const btnComanda = document.querySelector(".btn-comanda");
  const comandaContent = document.querySelector(".comanda-content");
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

    console.log("Executada!");

    comandaContent.classList.add("activeComanda");
    body.style.overflow = "auto";

    console.log(body);
  });
  console.log("Função toggleModal executada");
}

function addItemToContainer() {
  const inputsItemsContainer = document.querySelector(".inputs-container-item");
  const inputsItemQuantityContainer = document.querySelector(
    ".inputs-container-quantity"
  );
  const itemInput = document.createElement("input");
  const itemInputQuantity = document.createElement("input");
  const body = document.querySelector(".body");

  itemInput.setAttribute("placeholder", "Digite o item");
  itemInputQuantity.setAttribute("placeholder", "Digite a quantidade");
  itemInput.setAttribute("type", "text");
  itemInputQuantity.setAttribute("type", "number");

  inputsItemsContainer.appendChild(itemInput);
  inputsItemQuantityContainer.appendChild(itemInputQuantity);
  body.style.overflow = "auto";

  console.log(body);

  console.log("Função addItemToContainer executada!");
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
