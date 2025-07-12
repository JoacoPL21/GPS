const express = require("express");
const router = express.Router();
const fetch = require("node-fetch"); // o usa global fetch si tienes Node 18+
const CHILEXPRESS_KEY = process.env.CHILEXPRESS_API_KEY;

router.get("/cobertura", async (req, res) => {
    const { regionCode, comunaCode } = req.query;

    if (!regionCode || !comunaCode) {
        return res.status(400).json({ error: "regionCode y comunaCode son requeridos" });
    }
    // Log antes de llamar a la API
    console.log("Consultando cobertura:", { regionCode, comunaCode });

    try {
        const url = `https://testservices.wschilexpress.com/georeference/api/v1.0/coverage-areas?RegionCode=${regionCode}&type=0`;
        const response = await fetch(url, {
            headers: {
                "Ocp-Apim-Subscription-Key": CHILEXPRESS_KEY,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();

        // Log después del fetch
        console.log("Respuesta Chilexpress:", data);

        // Busca la comuna por código
        const encontrada = data.find(
            (c) => c.countyCode === comunaCode || c.ineCountyCode?.toString() === comunaCode
        );

        res.json({ cobertura: !!encontrada });
    } catch (err) {
        res.status(500).json({ error: "Error consultando Chilexpress" });
    }
});

module.exports = router;