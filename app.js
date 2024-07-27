const express = require("express");
const path = require("path");
const sql = require("mssql");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Configuração do SQL Server
const sqlConfig = {
  user: "sa",
  password: "@Bloodstrike11",
  database: "dbPP",
  server: "localhost",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

function escapeString(str) {
  return str.replace(/'/g, "''");
}

app.post("/venda-submit", async (req, res) => {
  const formData = req.body;
  console.log(formData);

  try {
    await sql.connect(sqlConfig);
    const request = new sql.Request();

    const decimalValue = parseFloat(formData["cost-payment"]).toFixed(2);

    const insertVendaQuery = `
      INSERT INTO vendas (order_time, order_address, order_address_number, method_payment, cost_payment, order_date, order_neighbourhood)
      VALUES (
        '${escapeString(formData["order-time"])}',
        '${escapeString(formData["order-address"])}',
        ${parseInt(formData["order-address-number"], 10)},
        '${escapeString(formData["method-payment"])}',
        ${decimalValue},
        '${escapeString(formData["order-date"])}',
        '${escapeString(formData["order-neighbourhood"])}'
      );
      SELECT SCOPE_IDENTITY() AS order_id;
    `;

    const vendaResult = await request.query(insertVendaQuery);
    const orderId = vendaResult.recordset[0].order_id;

    const items = formData.items;

    for (const item of items) {
      const productQuery = `
        SELECT product_id, product_price FROM produtos WHERE product_name = '${escapeString(
          item.product_name
        )}'
      `;
      const productResult = await request.query(productQuery);

      if (productResult.recordset.length > 0) {
        const product = productResult.recordset[0];
        const insertItemQuery = `
          INSERT INTO itens_vendas (order_id, product_id, quantity, product_price, product_name)
          VALUES (${orderId}, ${product.product_id}, ${item.quantity}, ${
          product.product_price
        }, '${escapeString(item.product_name)}');
        `;
        await request.query(insertItemQuery);
      }
    }

    res.send({ message: "Itens enviados para o SQL Server com sucesso!" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ error: "Houve um erro ao enviar os dados para o SQL Server." });
  }
});

app.post("/add-product", async (req, res) => {
  const formData = req.body;
  console.log(formData);

  try {
    await sql.connect(sqlConfig);
    const request = new sql.Request();

    const productSize = formData["product-size"]
      ? formData["product-size"]
      : null;
    const productPrice = parseFloat(formData["product-price"]);

    const query = `
      INSERT INTO produtos (product_name, product_description, product_price, product_type, product_size)
      VALUES (@product_name, @product_description, @product_price, @product_type, @product_size)
    `;

    request.input("product_name", sql.NVarChar, formData["product-name"]);
    request.input(
      "product_description",
      sql.NVarChar,
      formData["product-description"]
    );
    request.input("product_price", sql.Decimal(10, 2), productPrice);
    request.input("product_type", sql.NVarChar, formData["product-type"]);
    request.input("product_size", sql.NVarChar, productSize);

    await request.query(query);
    res.send({ message: "Produto adicionado ao banco de dados com sucesso!" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ error: "Houve um erro ao enviar o produto para o SQL Server." });
  }
});

sql.connect(sqlConfig, (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }

  console.log("Conectado ao banco de dados");

  app.get("/api/products", async (req, res) => {
    try {
      const result = await sql.query(
        "SELECT product_id, product_name FROM produtos"
      );
      res.json(result.recordset);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  });
});

function start() {
  try {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
