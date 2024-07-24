document.addEventListener("DOMContentLoaded", () => {
  const btnMenu = document.querySelector(".btn-menu");
  const menuOptionsHolder = document.querySelector(".menu-opcoes-holder");
  const menuOptionsContent = document.querySelector(".menu-opcoes-content");
  const comandaContent = document.querySelector(".comanda-content");
  const addProductDBContent = document.querySelector(".add-product-content");

  menuOptionsHolder.classList.remove("activeHolder");
  menuOptionsHolder.classList.remove("closeHolderTransition");
  comandaContent.classList.remove("active");
  addProductDBContent.classList.remove("active");
  console.log(addProductDBContent);
  console.log(comandaContent);

  toggleModal();

  const btnAddItem = document.querySelector(".btn-add-item");
  const btnResetForm = document.querySelector(".btn-reset-form");
  const btnResetProductForm = document.querySelector(".btn-reset-product-form");
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

  btnSendForm.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("Botão Enviar clicado");
  });

  btnDeleteItem.addEventListener("click", (event) => {
    event.preventDefault();

    removeItemFromContainer();

    console.log("Botão Retroceder clicado");
  });

  const vendaForm = document.getElementById("venda-form");

  btnAddItem.addEventListener("click", (event) => {
    event.preventDefault();
    addItemToContainer();
    initializeAutocomplete();
  });

  vendaForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submitVendaForm();
  });

  function addItemToContainer() {
    const inputsItemsContainer = document.querySelector(".inputs-container-item");
    const inputsItemQuantityContainer = document.querySelector(".inputs-container-quantity");

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

  function initializeAutocomplete() {
    const productInputs = document.querySelectorAll(".product-comanda-input");

    // Fetch products from API
    fetch("/api/products")
      .then((response) => response.json())
      .then((products) => {
        const productNames = products.map((product) => product.product_name);
        productInputs.forEach((input) => {
          new Awesomplete(input, { list: productNames });
        });
      })
      .catch((error) => {
        console.error("Erro ao carregar produtos:", error);
      });
  }

  function submitVendaForm() {
    const formData = new FormData(vendaForm);
    const items = [];
    const itemInputs = document.querySelectorAll(".inputs-container-item input");
    const quantityInputs = document.querySelectorAll(".inputs-container-quantity input");

    itemInputs.forEach((itemInput, index) => {
      const quantityInput = quantityInputs[index];
      items.push({
        product_name: itemInput.value,
        quantity: parseInt(quantityInput.value, 10)
      });
    });

    const vendaData = {
      "order-time": formData.get("order-time"),
      "order-address": formData.get("order-address"),
      "order-address-number": formData.get("order-address-number"),
      "method-payment": formData.get("method-payment"),
      "cost-payment": formData.get("cost-payment"),
      items: items
    };

    fetch("/venda-submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(vendaData)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        // Adicionar qualquer ação adicional após o sucesso
      })
      .catch((error) => {
        console.error("Erro ao enviar a comanda:", error);
      });
  }

  // Initialize autocomplete for existing inputs on page load
  initializeAutocomplete();
});

function toggleModal() {
  const btnMenu = document.querySelector(".btn-menu");
  const menuOptionsHolder = document.querySelector(".menu-opcoes-holder");
  const menuOptionsContent = document.querySelector(".menu-opcoes-content");
  const btnOptionsCloser = document.querySelector(".btn-close-menu");
  const btnComanda = document.querySelector(".btn-comanda");
  const btnAddProductDB = document.querySelector(".btn-newproductdb");
  const comandaContent = document.querySelector(".comanda-content");
  const addProductDBContent = document.querySelector(".add-product-content");
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

    console.log(body);
  });

  btnAddProductDB.addEventListener("click", () => {
    modalCloser();
    closeOtherOptions();

    console.log("Executada!");

    addProductDBContent.classList.add("active");
    body.style.overflow = "auto";

    console.log(body);
  });

  console.log("Função toggleModal executada");
}

function closeOtherOptions() {
  const comandaContent = document.querySelector(".comanda-content");
  const addProductDBContent = document.querySelector(".add-product-content");

  comandaContent.classList.remove("active");
  addProductDBContent.classList.remove("active");
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