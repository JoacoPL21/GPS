import express from "express";
const router = express.Router();

const CHILEXPRESS_KEY = process.env.CHILEXPRESS_API_KEY;

// Mapeo de códigos de región INE a códigos de región Chilexpress
const regionCodeMap = {
    '1': 'R1',
    '2': 'R2', 
    '3': 'R3',
    '4': 'R4',
    '5': 'R5',
    '6': 'R6',
    '7': 'R7',
    '8': 'R8',
    '9': 'R9',
    '10': 'R10',
    '11': 'R11',
    '12': 'R12',
    '13': 'RM',
    '14': 'R14',
    '15': 'R15',
    '16': 'R16'
};

router.get("/cobertura", async (req, res) => {
    const { regionCode, comunaCode } = req.query;

    if (!regionCode || !comunaCode) {
        return res.status(400).json({ 
            error: "regionCode y comunaCode son requeridos",
            message: "Debe proporcionar tanto el código de región como el código de comuna"
        });
    }

    // Convertir código de región al formato de Chilexpress
    const chilexpressRegionCode = regionCodeMap[regionCode] || regionCode;

    console.log("Consultando cobertura:", { 
        regionCode: regionCode, 
        comunaCode: comunaCode,
        chilexpressRegionCode: chilexpressRegionCode 
    });

    try {
        // Usar la URL de producción o desarrollo según el entorno
        const baseUrl = process.env.NODE_ENV === 'production' 
            ? 'https://services.wschilexpress.com'
            : 'https://testservices.wschilexpress.com';
            
        const url = `${baseUrl}/georeference/api/v1.0/coverage-areas?RegionCode=${chilexpressRegionCode}&type=0`;
        
        console.log("URL de consulta:", url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Ocp-Apim-Subscription-Key": CHILEXPRESS_KEY,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error HTTP ${response.status}:`, errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("Respuesta Chilexpress:", JSON.stringify(data, null, 2));

        // Verificar que la respuesta sea exitosa según la documentación
        if (data.statusCode !== 0) {
            console.log("Error en respuesta Chilexpress:", data.statusDescription);
            return res.json({ 
                cobertura: false, 
                message: data.statusDescription || "Sin cobertura disponible"
            });
        }

        // Verificar que existan áreas de cobertura
        if (!data.coverageAreas || !Array.isArray(data.coverageAreas) || data.coverageAreas.length === 0) {
            console.log("No hay áreas de cobertura disponibles");
            return res.json({ 
                cobertura: false,
                message: "No hay cobertura disponible para esta región"
            });
        }

        // Buscar la comuna específica en las áreas de cobertura
        const encontrada = data.coverageAreas.find(area => {
            // Normalizar códigos para comparación
            const normalizeCode = (code) => {
                if (!code) return null;
                return parseInt(code.toString().replace(/^0+/, '') || '0', 10);
            };
            
            const comunaNormalizada = normalizeCode(comunaCode);
            const areaNormalizada = normalizeCode(area.ineCountyCode);
            
            return areaNormalizada === comunaNormalizada;
        });

        console.log("Detalles de búsqueda:", {
            comunaCodeOriginal: comunaCode,
            comunaNormalizada: parseInt(comunaCode.toString().replace(/^0+/, '') || '0', 10),
            totalAreas: data.coverageAreas.length,
            ejemploArea: data.coverageAreas[0] ? {
                name: data.coverageAreas[0].countyName,
                ineCode: data.coverageAreas[0].ineCountyCode
            } : null
        });

        console.log("Comuna encontrada:", encontrada ? 
            `${encontrada.countyName} (${encontrada.countyCode}) - INE: ${encontrada.ineCountyCode}` : 
            "No encontrada");

        if (encontrada) {
            res.json({ 
                cobertura: true,
                data: {
                    countyName: encontrada.countyName,
                    countyCode: encontrada.countyCode,
                    ineCountyCode: encontrada.ineCountyCode,
                    regionCode: encontrada.regionCode,
                    coverageName: encontrada.coverageName,
                    ppd: encontrada.ind_ppd === 1,
                    rd: encontrada.ind_rd === 1
                }
            });
        } else {
            res.json({ 
                cobertura: false,
                message: "No hay cobertura disponible para esta comuna",
                debug: {
                    regionCode: regionCode,
                    chilexpressRegionCode: chilexpressRegionCode,
                    comunaCode: comunaCode,
                    comunaNormalizada: parseInt(comunaCode.toString().replace(/^0+/, '') || '0', 10),
                    totalCoverageAreas: data.coverageAreas.length
                }
            });
        }

    } catch (err) {
        console.error("Error detallado en chilexpress:", err);
        res.status(500).json({ 
            error: "Error consultando Chilexpress",
            message: err.message,
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// Endpoint adicional para obtener todas las regiones
router.get("/regiones", async (req, res) => {
    try {
        const baseUrl = process.env.NODE_ENV === 'production' 
            ? 'https://services.wschilexpress.com'
            : 'https://testservices.wschilexpress.com';
            
        const url = `${baseUrl}/georeference/api/v1.0/regions`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Ocp-Apim-Subscription-Key": CHILEXPRESS_KEY,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.statusCode !== 0) {
            return res.status(400).json({ 
                error: data.statusDescription || "Error en la consulta de regiones"
            });
        }

        res.json({
            success: true,
            data: data.regions || []
        });

    } catch (err) {
        console.error("Error obteniendo regiones:", err);
        res.status(500).json({ 
            error: "Error consultando regiones",
            message: err.message
        });
    }
});

// Endpoint adicional para obtener todas las áreas de cobertura de una región
router.get("/areas-cobertura/:regionCode", async (req, res) => {
    const { regionCode } = req.params;

    if (!regionCode) {
        return res.status(400).json({ error: "regionCode es requerido" });
    }

    // Convertir código de región al formato de Chilexpress
    const chilexpressRegionCode = regionCodeMap[regionCode] || regionCode;

    try {
        const baseUrl = process.env.NODE_ENV === 'production' 
            ? 'https://services.wschilexpress.com'
            : 'https://testservices.wschilexpress.com';
            
        const url = `${baseUrl}/georeference/api/v1.0/coverage-areas?RegionCode=${chilexpressRegionCode}&type=0`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Ocp-Apim-Subscription-Key": CHILEXPRESS_KEY,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.statusCode !== 0) {
            return res.status(400).json({ 
                error: data.statusDescription || "Error en la consulta"
            });
        }

        res.json({
            success: true,
            data: data.coverageAreas || []
        });

    } catch (err) {
        console.error("Error obteniendo áreas de cobertura:", err);
        res.status(500).json({ 
            error: "Error consultando áreas de cobertura",
            message: err.message
        });
    }
});

export default router;