import ChilexpressRegionComunaSelector from "../../components/ChilexpressSelector.jsx"

const Dashboard = () => {
   

    // Aquí puedes manejar el estado y la lógica del dashboard
    // Por ejemplo, puedes usar useState para manejar los valores de región y comuna
   

    return (
        <div className="dashboard">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <ChilexpressRegionComunaSelector
                regionValue="" // Default value or controlled value
                comunaValue="" // Default value or controlled value
                onChange={(values) => console.log("Selected values:", values)}
                error="" // Error message if any
                fetchComunasPorRegion={(region) => {
                    // Mock function to simulate fetching comunas
                    console.log("Fetching comunas for region:", region);
                }}
                loading={false} // Loading state
                regiones={[]} // List of regions
                comunasPorRegion={{}} // Map of regions to their comunas
            />
        </div>
    );
}

export default Dashboard;

