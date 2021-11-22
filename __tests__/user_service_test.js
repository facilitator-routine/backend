require('dotenv').config();
const { testDbConfig } = require('../config');
const { connectDb, disconnectDb, clearDb } = require('../db/mongodb');
const User = require('../models/User')
const UserSpotifyCredential = require('../models/UserSpotifyCredentials')
const userService = require('../service/userService')

describe("User Service", () => {
    beforeAll(async () => {
        await connectDb(testDbConfig)
    })

    afterAll(done => {
        disconnectDb(done)
    })

    beforeEach(() => {
        clearDb()
    })

    test("Busco usuario y no lo encuentro", async () => {
        const mail = "prueba@mail.com"
        const body = {display_name: "USER", email: "prueba@mail.com", id: "1"}
        const access_token = "access_token"
        const refresh_token = "refresh_token"
        const user = await userService.findOneOrCreateNewUser(body, access_token, refresh_token)
        expect(user.email).toBe(mail)
    })

    test("Busco usuario y lo encuentro sin credenciales, creo credenciales", async () => {
        const mail = "prueba@mail.com"
        const body = {display_name: "USER", email: "prueba@mail.com", id: "1"}
        const access_token = "access_token"
        const refresh_token = "refresh_token"
        const persistUser = await User({name: "USER", email: mail}).save()
        const user = await userService.findOneOrCreateNewUser(body, access_token, refresh_token)
        expect(user.email).toBe(persistUser.email)
        expect(user.name).toBe(persistUser.name)
        expect(user.spotifyCredential.spotifyToken).toBe(access_token)

    })
    test("Busco usuario y lo encuentro con credenciales", async () => {
        const mail = "prueba@mail.com"
        const body = {display_name: "USER", email: "prueba@mail.com", id: "1"}
        const access_token = "access_token"
        const refresh_token = "refresh_token"
        const credential = await UserSpotifyCredential({
            spotifyClientId: body.id,
            spotifyToken: access_token,
            spotifyRefreshToken: refresh_token
        }).save()
        const persistUser = await User({name: "USER", email: mail, spotifyCredential: credential}).save()
        const user = await userService.findOneOrCreateNewUser(body, access_token, refresh_token)
        expect(user.email).toBe(persistUser.email)
        expect(user.name).toBe(persistUser.name)
        expect(user.spotifyCredential.spotifyToken).toBe(access_token)
    })
})