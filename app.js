const express = require("express");
const path = require("path");
const sql = require("mssql");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const moment = require("moment");
const session = require("express-session");
const { log } = require("console");
const fs = require("fs");

const app = express();
const port = 3000;

const backupDir = path.join(__dirname, "backup");
const backupFile = path.join(backupDir, "dbPP.bak");

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
    const orderTime = formData["order-time"]
      ? `'${escapeString(formData["order-time"])}'`
      : "NULL";

    const insertVendaQuery = `
      INSERT INTO vendas (
        order_time, 
        order_address, 
        order_address_number, 
        method_payment, 
        cost_payment, 
        order_date, 
        order_neighbourhood, 
        username, 
        order_type
      )
      VALUES (
        ${orderTime}, 
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
        SELECT product_id, product_price 
        FROM produtos 
        WHERE product_name = '${escapeString(item.product_name)}'
      `;
      const productResult = await request.query(productQuery);

      if (productResult.recordset.length > 0) {
        const product = productResult.recordset[0];
        const insertItemQuery = `
          INSERT INTO itens_vendas (
            order_id, 
            product_id, 
            quantity, 
            product_price, 
            product_name, 
            category
          )
          VALUES (
            ${orderId}, 
            ${product.product_id}, 
            ${item.quantity}, 
            ${product.product_price}, 
            '${escapeString(item.product_name)}',
            '${escapeString(item.category)}'
          );
        `;
        await request.query(insertItemQuery);
      }
    }

    const meiaItems = formData.meiaItems;
    for (const meiaItem of meiaItems) {
      const productQuery1 = `
        SELECT product_id, product_price 
        FROM produtos 
        WHERE product_name = '${escapeString(meiaItem.product_name_1)}'
      `;
      const productResult1 = await request.query(productQuery1);

      const productQuery2 = `
        SELECT product_id, product_price 
        FROM produtos 
        WHERE product_name = '${escapeString(meiaItem.product_name_2)}'
      `;
      const productResult2 = await request.query(productQuery2);

      if (
        productResult1.recordset.length > 0 &&
        productResult2.recordset.length > 0
      ) {
        const product1 = productResult1.recordset[0];
        const product2 = productResult2.recordset[0];

        const insertMeiaItemQuery1 = `
          INSERT INTO itens_meio_a_meio (
            order_id, 
            product_id, 
            quantity, 
            product_price, 
            product_name, 
            category
          )
          VALUES (
            ${orderId}, 
            ${product1.product_id}, 
            ${meiaItem.quantity}, 
            ${product1.product_price}, 
            '${escapeString(meiaItem.product_name_1)}',
            '${escapeString(meiaItem.category)}'
          );
        `;
        const insertMeiaItemQuery2 = `
          INSERT INTO itens_meio_a_meio (
            order_id, 
            product_id, 
            quantity, 
            product_price, 
            product_name, 
            category
          )
          VALUES (
            ${orderId}, 
            ${product2.product_id}, 
            ${meiaItem.quantity}, 
            ${product2.product_price}, 
            '${escapeString(meiaItem.product_name_2)}',
            '${escapeString(meiaItem.category)}'
          );
        `;
        await request.query(insertMeiaItemQuery1);
        await request.query(insertMeiaItemQuery2);
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
    await sql.connect(sqlConfig);

    const result = await sql.query(
      "SELECT funcionario_id, funcionario_name FROM funcionarios"
    );

    res.json(result.recordset);
  } catch (err) {
    console.error("Erro ao buscar funcionários:", err);
    res.status(500).json({ error: "Erro ao buscar funcionários" });
  } finally {
    await sql.close();
  }
});

app.get("/api/products", async (req, res) => {
  try {
    await sql.connect(sqlConfig);

    const result = await sql.query(
      "SELECT product_id, product_name FROM produtos"
    );
    res.json(result.recordset);
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

app.get("/api/accounts", async (req, res) => {
  const funcionarioId = req.query.funcionario_id;
  const query = `
    SELECT funcionario_account 
    FROM funcionarios_accounts 
    WHERE funcionario_id = @funcionarioId`;

  try {
    await sql.connect(sqlConfig);

    const request = new sql.Request();
    request.input("funcionarioId", sql.Int, funcionarioId);

    const result = await request.query(query);

    res.json(result.recordset);
  } catch (err) {
    console.error("Erro ao buscar contas:", err);
    res.status(500).send("Erro ao buscar contas");
  } finally {
    await sql.close();
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    await sql.connect(sqlConfig);
    const request = new sql.Request();
    const result = await request.query(
      "SELECT category FROM pizzas_categorias"
    );

    res.json(result.recordset);
  } catch (err) {
    console.error("Erro ao buscar categorias:", err);
    res.status(500).send({ error: "Erro ao buscar categorias" });
  } finally {
    await sql.close();
  }
});

app.get("/venda-detalhes/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    await sql.connect(sqlConfig);

    const request = new sql.Request();
    request.input("orderId", sql.Int, orderId);

    const queryVendaItems = `
      SELECT iv.product_name, iv.quantity, iv.product_price
      FROM itens_vendas iv
      WHERE iv.order_id = @orderId;
    `;
    const vendaItemsResult = await request.query(queryVendaItems);

    const queryMeiaItems = `
      SELECT im.product_name, im.product_price, im.quantity
      FROM itens_meio_a_meio im
      WHERE im.order_id = @orderId;
    `;
    const meiaItemsResult = await request.query(queryMeiaItems);

    const groupedMeiaItems = [];
    for (let i = 0; i < meiaItemsResult.recordset.length; i += 2) {
      const item1 = meiaItemsResult.recordset[i];
      const item2 = meiaItemsResult.recordset[i + 1] || {};
      groupedMeiaItems.push({
        product_name_1: item1.product_name,
        product_price_1: item1.product_price,
        product_name_2: item2.product_name || "",
        product_price_2: item2.product_price || "",
        quantity: item1.quantity,
      });
    }

    const vendaDetalhes = {
      items: vendaItemsResult.recordset,
      meiaItems: groupedMeiaItems,
    };

    res.json(vendaDetalhes);
  } catch (error) {
    console.error("Erro ao buscar detalhes da venda:", error);
    res.status(500).json({ error: "Erro ao buscar detalhes da venda" });
  } finally {
    await sql.close();
  }
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

app.get("/api/vendas", (req, res) => {
  const { orderDate } = req.query;

  let query = `SELECT order_id, CONVERT(VARCHAR(8), order_time, 108) AS formatted_time, cost_payment, username
               FROM vendas 
               WHERE order_date = @orderDate`;

  sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool
        .request()
        .input("orderDate", sql.Date, orderDate)
        .query(query);
    })
    .then((result) => {
      if (result.recordset.length === 0) {
        res.json({
          message: "Nenhum resultado encontrado para a data especificada.",
        });
      } else {
        res.json(result.recordset);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err.message);
    });
});

app.post("/contar-vendas", async (req, res) => {
  const { orderDate } = req.body;

  if (!orderDate) {
    return res.status(400).json({ error: "Nenhuma data foi fornecida." });
  }

  try {
    await sql.connect(sqlConfig);

    const formattedDate = orderDate.split("/").reverse().join("-");

    const request = new sql.Request();
    request.input("formattedDate", sql.Date, formattedDate);

    const query = `
      WITH PizzasInteiras AS (
        -- Contar pizzas inteiras
        SELECT
          'Pizza Inteira' AS product_type,
          SUM(iv.quantity) AS quantidade_vendida
        FROM vendas v
        JOIN itens_vendas iv ON v.order_id = iv.order_id
        JOIN produtos p ON iv.product_id = p.product_id
        WHERE v.order_date = @formattedDate
        AND p.product_type = 'Pizza Inteira'
        GROUP BY p.product_type
      ),
      PizzasMeioAMeio AS (
        -- Identificar todos os itens meio a meio
        SELECT
          im.order_id,
          COUNT(*) AS item_count
        FROM itens_meio_a_meio im
        JOIN vendas v ON v.order_id = im.order_id
        WHERE v.order_date = @formattedDate
        GROUP BY im.order_id
      ),
      TotalMeioAMeio AS (
        -- Contar o número total de pizzas meio a meio
        SELECT
          SUM(item_count / 2) AS quantidade_vendida
        FROM PizzasMeioAMeio
        WHERE item_count % 2 = 0
      )
      SELECT
        product_type,
        SUM(quantidade_vendida) AS quantidade_vendida
      FROM (
        -- Consulta para pizzas inteiras
        SELECT
          product_type,
          quantidade_vendida
        FROM PizzasInteiras

        UNION ALL

        -- Consulta para pizzas meio a meio
        SELECT
          'Pizza Meio a Meio' AS product_type,
          quantidade_vendida
        FROM TotalMeioAMeio

        UNION ALL

        -- Consulta para outros produtos
        SELECT
          p.product_type,
          SUM(iv.quantity) AS quantidade_vendida
        FROM vendas v
        JOIN itens_vendas iv ON v.order_id = iv.order_id
        JOIN produtos p ON iv.product_id = p.product_id
        WHERE v.order_date = @formattedDate
        AND p.product_type <> 'Pizza Inteira' -- Excluir pizzas inteiras
        AND p.product_type <> 'Pizza Meio a Meio' -- Excluir pizzas meio a meio
        GROUP BY p.product_type
      ) AS combined
      GROUP BY product_type
    `;

    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ error: "Nenhuma venda encontrada para a data especificada." });
    }

    res.json(result.recordset);
  } catch (err) {
    console.error("Erro ao contar vendas:", err);
    res.status(500).json({ error: "Erro ao contar vendas." });
  } finally {
    await sql.close();
  }
});

async function backupDatabase() {
  try {
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
      console.log(`Diretório criado: ${backupDir}`);
    }

    await sql.connect(sqlConfig);

    const backupQuery = `
      BACKUP DATABASE dbPP
      TO DISK = '${backupFile}'
      WITH FORMAT,
      NAME = 'Backup Completo do dbPP';
    `;

    await sql.query(backupQuery);

    console.log("Backup realizado com sucesso!");
    return { success: true, message: "Backup realizado com sucesso!" };
  } catch (err) {
    console.error("Erro ao realizar o backup:", err);
    return {
      success: false,
      message: `Erro ao realizar o backup: ${err.message}`,
    };
  } finally {
    await sql.close();
  }
}

app.post("/backup", async (req, res) => {
  const result = await backupDatabase();
  if (result.success) {
    res.status(200).json({ message: result.message });
  } else {
    res.status(500).json({ message: result.message });
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
