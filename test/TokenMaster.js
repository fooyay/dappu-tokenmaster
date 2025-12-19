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

        it("Returns occasion attributes", async () => {
            const occasion = await tokenMaster.getOccasion(1)
            expect(occasion.id).to.equal(1)
            expect(occasion.name).to.equal(OCCASION_NAME)
            expect(occasion.cost).to.equal(OCCASION_COST)
            expect(occasion.tickets).to.equal(OCCASION_MAX_TICKETS)
            expect(occasion.maxTickets).to.equal(OCCASION_MAX_TICKETS)
            expect(occasion.date).to.equal(OCCASION_DATE)
            expect(occasion.time).to.equal(OCCASION_TIME)
            expect(occasion.location).to.equal(OCCASION_LOCATION)
        })

    })

    describe("Purchasing", () => {
        const ID = 1
        const SEAT = 50
        const AMOUNT = ethers.utils.parseEther("1")

        beforeEach(async () => {
            const transaction = await tokenMaster.connect(buyer).buyTicket(ID, SEAT, { value: AMOUNT })
            await transaction.wait()
        })

        it("Updates the ticket count", async () => {
            const occasion = await tokenMaster.getOccasion(ID)
            expect(occasion.tickets).to.equal(OCCASION_MAX_TICKETS - 1)
        })

        it("Updates the buying status", async () => {
            const status = await tokenMaster.hasBought(ID, buyer.address)
            expect(status).to.equal(true)
        })

        it("Updates the seat owner", async () => {
            const seatOwner = await tokenMaster.seatTaken(ID, SEAT)
            expect(seatOwner).to.equal(buyer.address)
        })

        it("Updates overall seating status", async () => {
            const seatsTaken = await tokenMaster.getSeatsTaken(ID)
            expect(seatsTaken.length).to.equal(1)
            expect(seatsTaken[0]).to.equal(SEAT)
        })

        it("Updates contract balance", async () => {
            const contractBalance = await ethers.provider.getBalance(tokenMaster.address)
            expect(contractBalance).to.equal(AMOUNT)
        })
    })
})