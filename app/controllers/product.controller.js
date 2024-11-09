import { Product } from "../models/product.model.js";

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.json({ product });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.json({ product });
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.json({ product });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Query pram --> ?price=500&limit=10&page=1
const findProductsByFilters = async (req, res) => {
  try {
    let queryObjects = { ...req.query };
    console.log(queryObjects);

    const withOutFields = ["page", "sort", "limit", "fields"];

    withOutFields.forEach((field) => delete queryObjects[field]);
    console.log(queryObjects);

    //Vamos a reemplazar los operadores por su sintaxis habitual para poder utilizarlos en la comnsulta
    //Transformnar el objeto a una cadena de texto
    let stringQuery = JSON.stringify(queryObjects);

    stringQuery = stringQuery.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    queryObjects = JSON.parse(stringQuery);

    //"price,title"
    let sort = "";
    if (req.query.sort) {
      const fields = req.query.sort.split(",").join(" ");
      sort = fields;
    }

    let selected = "";

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      selected = fields;
    }

    //paginacion
    //skip --> saltar elementos
    //limit --> es la cantidad de elementos que vamos a moestrar por página
    //Quiero traer la inforamción de la primera pagina
    //page = 1, limit = 10 --> skip = (0) limit = 10
    //page = 2, limit = 10 --> skip = (10) limit = 10
    //page = 3, limit = 10 --> skip = (20) limit = 10

    let limit = req.query.limit || 100;
    let page = req.query.page || 1;

    let skip = (page - 1) * limit;

    //Query params desde Postman ---> localhost:8080/products/by-filters?price[gte]=500&limit=1&page=2&sort=price&fields=title,price
    const products = await Product.find(queryObjects)
      .select(selected)
      .sort(sort)
      .limit(limit)
      .skip(skip);
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductsStatistics = async (req, res) => {
  try {
    //Vamos a definir los pasos de nuestro pipeline (es la ejecución de una secuencia de pasos u operaciones)
    //El primer paso es un match --> es el paso donde vamos a filtrar los documentos
    const statistics = await Product.aggregate([
      //Primer paso match, el resultado o la salida de este psao sirve como datos de entrada del paso siguiente
      {
        $match: { price: { $gte: 5 } },
      },
      //El segundo paso es procesar los documentos para resolver un proceso complejo
      //Vamos a agrupar todos los productos y vamos a hacer los siguiente:
      //1.- Vamos a contar cuantos productos hay en total
      //2.- Vamos a calcular el precio promedio de nuestros productos
      //3.- Vamos a obtener el precio mínimo
      //4.- Vamos a obtener el precio máximo

      {
        $group: {
          //Para poder definir cual es la condición de agrupamiento usamos el atributo _id
          //Vamos a agrupar todos los prodcutos
          _id: "$category",
          count: { $sum: 1 }, //Vamos a ir sumando uno cada vez que encuentre un elemento
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      //El tercer putno es asplicar un ordenamineto
      {
        $sort: {
          avgPrice: -1,
        },
      },
    ]);
    res.json({ statistics });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllProducts,
  saveProduct,
  updateProduct,
  getProductById,
  deleteProduct,
  findProductsByFilters,
  getProductsStatistics,
};
