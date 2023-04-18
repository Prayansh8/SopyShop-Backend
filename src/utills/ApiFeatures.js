class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  search() {
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  category() {
    const category = this.queryString.category
      ? { category: this.queryString.category }
      : {};

    this.query = this.query.find({ ...category });
    return this;
  }

  price() {
    const minPrice = this.queryString['price[gte]']
      ? { price: { $gte: Number(this.queryString['price[gte]']) } }
      : {};
    const maxPrice = this.queryString['price[lte]']
      ? { price: { $lte: Number(this.queryString['price[lte]']) } }
      : {};

    this.query = this.query.find({ ...minPrice, ...maxPrice });
    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page) || 1;
    const resultPerPage = parseInt(this.queryString.resultPerPage) || 8;
    const skip = (page - 1) * resultPerPage;

    this.query = this.query.skip(skip).limit(resultPerPage);
    return this;
  }
}

module.exports = ApiFeatures;
