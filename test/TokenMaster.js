const { expect } = require("chai")

const NAME = "TokenMaster"
const SYMBOL = "TM"

describe("TokenMaster", () => {
    let tokenMaster
    let deployer, buyer

    const OCCASION_NAME = "ETH Texas"
    const OCCASION_COST = ethers.utils.parseEther("1")
    const OCCASION_MAX_TICKETS = 100
    const OCCASION_DATE = "Apr 27"
    const OCCASION_TIME = "10:00 AM CST"
    const OCCASION_LOCATION = "Austin, TX"

    beforeEach(async () => {
        [deployer, buyer] = await ethers.getSigners()

        const TokenMaster = await ethers.getContractFactory("TokenMaster")
        tokenMaster = await TokenMaster.deploy(NAME, SYMBOL)

        const transaction  = await tokenMaster.connect(deployer).list(
            OCCASION_NAME,
            OCCASION_COST,
            OCCASION_MAX_TICKETS,
            OCCASION_DATE,
            OCCASION_TIME,
            OCCASION_LOCATION
        )
        await transaction.wait()
    })

    describe("Deployment", () => {
        it("Sets the name", async () => {
            let name = await tokenMaster.name()
            expect(name).to.equal(NAME)
        })

        it("Sets the symbol", async () => {
            let symbol = await tokenMaster.symbol()
            expect(symbol).to.equal(SYMBOL)
        })

        it("Sets the deployer as the owner", async () => {
            let owner = await tokenMaster.owner()
            expect(owner).to.equal(deployer.address)
        })
    })

    describe("Occasions", () => {

        it("Updates occasion count on creation", async () => {
            const totalOccasions = await tokenMaster.totalOccasions()
            expect(totalOccasions).to.equal(1)
        })

    })
})
