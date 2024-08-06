const express = require("express");
const path = require("path");
const sql = require("mssql");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const moment = require("moment");
const session = require("express-session");
const { log } = require("console");

const app = express();
const port = 3000;

// Configuração do SQL Server
const sqlConfig = {
  user: "sa",
  password: "281575je",
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

app.use(
  session({
    secret: "aAD@dk32Dkf%dsapizza",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

sql.connect(sqlConfig, (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }

  console.log("Conectado ao banco de dados");
});

app.get("/get-username", (req, res) => {
  if (req.session.username) {
    res.json({ username: req.session.username });
  } else {
    res.status(401).send("Usuário não autenticado");
  }
});

app.get("/", (req, res) => {
  if (req.session.username) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  } else {
    res.redirect("/login");
  }
});

function escapeString(str) {
  return str.replace(/'/g, "''");
}

app.post("/venda-submit", async (req, res) => {
  const formData = req.body;
  console.log(formData);

  const orderDate = moment(formData["order-date"], "DD/MM/YYYY").format(
    "YYYY-MM-DD"
  );

  try {
    await sql.connect(sqlConfig);
    const request = new sql.Request();

    const decimalValue = parseFloat(formData["cost-payment"]).toFixed(2);

    const username = req.session.username
      ? escapeString(req.session.username)
      : "Anônimo";

    const orderAddress = formData["order-address"]
      ? `'${escapeString(formData["order-address"])}'`
      : "NULL";
    const orderAddressNumber = formData["order-address-number"]
      ? parseInt(formData["order-address-number"], 10)
      : "NULL";
    const orderNeighbourhood = formData["order-neighbourhood"]
      ? `'${escapeString(formData["order-neighbourhood"])}'`
      : "NULL";

    const insertVendaQuery = `
      INSERT INTO vendas (order_time, order_address, order_address_number, method_payment, cost_payment, order_date, order_neighbourhood, username, order_type)
      VALUES (
        '${escapeString(formData["order-time"])}',
        ${orderAddress},
        ${orderAddressNumber},
        '${escapeString(formData["method-payment"])}',
        ${decimalValue},
        '${orderDate}',
        ${orderNeighbourhood},
        '${username}',
        '${escapeString(formData["order-type"])}'
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

app.post("/add-payment", async (req, res) => {
  const formData = req.body;
  console.log(formData);

  try {
    await sql.connect(sqlConfig);
    const request = new sql.Request();

    const username = req.session.username
      ? escapeString(req.session.username)
      : "Anônimo";

    for (let i = 0; i < formData.items.length; i++) {
      const item = formData.items[i];
      const paymentDate = moment(item.data, "DD/MM/YYYY").format("YYYY-MM-DD");

      const funcionarioID = parseInt(item.funcionarioID, 10);
      const pagamento = parseFloat(item.pagamento).toFixed(2);
      const descricao = escapeString(item.descricao);
      const account = escapeString(item.account);

      const query = `
        INSERT INTO pagamentos_funcionarios (funcionario_id, payment_date, payment_amount, description, account, username)
        VALUES (
          ${funcionarioID},
          '${paymentDate}',
          ${pagamento},
          '${descricao}',
          '${account}',
          '${username}'
        )
      `;

      await request.query(query);
    }

    res.send({
      message: "Pagamentos adicionados ao banco de dados com sucesso!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Houve um erro ao enviar os dados para o SQL Server.",
    });
  }
});

app.post("/fechamento-submit", async (req, res) => {
  const formData = req.body;
  console.log(formData);

  const fechamentoDate = moment(
    formData["fechamentoDate"],
    "DD/MM/YYYY"
  ).format("YYYY-MM-DD");

  const formatValue = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0.0 : num.toFixed(2);
  };

  try {
    await sql.connect(sqlConfig);
    const request = new sql.Request();

    const username = req.session.username
      ? escapeString(req.session.username)
      : "Anônimo";

    const initialValue = formatValue(formData["initialValue"]);
    const finalValue = formatValue(formData["finalValue"]);
    const pix = formatValue(formData["pix"]);
    const credit = formatValue(formData["credit"]);
    const debit = formatValue(formData["debit"]);
    const cash = formatValue(formData["cash"]);
    const outputValue = formatValue(formData["outputValue"]);

    const query = `
      INSERT INTO fechamento (fechamento_date, initial_value, final_value, pix, credit, debit, cash, output_value, username)
      VALUES (
        '${fechamentoDate}',
        ${initialValue},
        ${finalValue},
        ${pix},
        ${credit},
        ${debit},
        ${cash},
        ${outputValue},
        '${username}'
      )
    `;

    await request.query(query);
    res.send({
      message: "Dados de fechamento adicionados ao banco de dados com sucesso!",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ error: "Houve um erro ao enviar os dados para o SQL Server." });
  }
});

app.post("/addaccount-submit", async (req, res) => {
  const { funcionarioId, funcionarioAccount } = req.body;

  try {
    const pool = await sql.connect(sqlConfig);

    await pool
      .request()
      .input("funcionarioId", sql.Int, funcionarioId)
      .input("funcionarioAccount", sql.NVarChar, funcionarioAccount).query(`
        INSERT INTO funcionarios_accounts (funcionario_id, funcionario_account)
        VALUES (@funcionarioId, @funcionarioAccount)
      `);

    res
      .status(200)
      .send({ message: "Conta do funcionário adicionada com sucesso." });
  } catch (error) {
    console.error("Erro ao adicionar conta do funcionário:", error);
    res.status(500).send({ error: "Erro ao adicionar conta do funcionário." });
  }
});

app.delete("/delete-payment/:id", async (req, res) => {
  const pagamentoId = req.params.id;

  try {
    await sql.connect(sqlConfig);
    const request = new sql.Request();

    const query = `DELETE FROM pagamentos_funcionarios WHERE pagamento_id = ${pagamentoId}`;
    await request.query(query);

    res.send({
      message: "Pagamento deletado com sucesso!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Houve um erro ao deletar o pagamento.",
    });
  }
});

app.get("/api/funcionarios", async (req, res) => {
  try {
    const result = await sql.query(
      "SELECT funcionario_id, funcionario_name FROM funcionarios"
    );
    res.json(result.recordset);
  } catch (err) {
    console.error("Erro ao buscar funcionários:", err);
    res.status(500).json({ error: "Erro ao buscar funcionários" });
  }
});

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

app.get("/api/accounts", (req, res) => {
  const funcionarioId = req.query.funcionario_id;
  const query = `
    SELECT funcionario_account 
    FROM funcionarios_accounts 
    WHERE funcionario_id = @funcionarioId`;

  const request = new sql.Request();
  request.input("funcionarioId", sql.Int, funcionarioId);
  request.query(query, (err, result) => {
    if (err) {
      console.error("Erro ao buscar contas:", err);
      res.status(500).send("Erro ao buscar contas");
    } else {
      res.json(result.recordset);
    }
  });
});

app.get("/api/tabela", async (req, res) => {
  try {
    console.log("Rota /api/tabela chamada");

    const result = await sql.query(`
      SELECT 
          pf.pagamento_id,
          pf.funcionario_id,
          f.funcionario_name AS funcionario_name,
          pf.account,
          pf.payment_date,
          pf.payment_amount,
          pf.description,
          pf.username
      FROM 
          pagamentos_funcionarios pf
      JOIN 
          funcionarios f 
      ON 
          pf.funcionario_id = f.funcionario_id;
    `);

    console.log("Dados recebidos do banco de dados:", result.recordset);
    res.json(result.recordset);
  } catch (err) {
    console.error("Erro ao buscar tabela pagamentos:", err);
    res.status(500).send({ message: err.message });
  }
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    await sql.connect(sqlConfig);
    const request = new sql.Request();

    const getUserQuery = `
      SELECT * FROM users WHERE LOWER(username) = LOWER(@username);
    `;

    request.input("username", sql.NVarChar, username);

    const result = await request.query(getUserQuery);
    const user = result.recordset[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.username = username;
      res.redirect("/");
    } else {
      res.status(401).send("Credenciais inválidas");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao fazer login");
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao fazer logout" });
    }
    res.redirect("/login");
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
