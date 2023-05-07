const country= require("country-state-picker")

module.exports.getCountryCode = async (req, res) =>{
     try {
        let states = country.getCountries()
        res.status(200).json({message:states})
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}