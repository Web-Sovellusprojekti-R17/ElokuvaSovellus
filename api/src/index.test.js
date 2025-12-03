import { expect } from "chai"

describe("Testing basic database functionality", () => {
 it("should get all reviews", async () => {
 const response = await fetch("http://localhost:3001/review")
 const data = await response.json()
 expect(response.status).to.equal(200)
 expect(data).to.be.an("array").that.is.not.empty
 expect(data[0]).to.include.all.keys(["review_id", "movie_id", "user_id", "review", "author", "rating"])
 })
})