class APIFeatures {
   constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
   }

   paginate() {
      const thePage = parseInt(this.queryString.page, 10) || 1;
      const theLimit = parseInt(this.queryString.limit, 10) || 100;
      const theSkip = (thePage - 1) * theLimit;

      this.query = this.query.skip(theSkip).limit(theLimit);
      return this;
   }
}

module.exports = APIFeatures;
