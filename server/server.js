import app from './express'
import config from '../config/config'
import { sequelize } from '../config/config-db'

const dropDatabaseSync = false

sequelize.sync({ force: dropDatabaseSync }).then(async () => {
    if (dropDatabaseSync) console.log('Connection established successfully.')

    app.listen(config.port, () =>
        console.log('Server started on port %s.', config.port)
    )
})

export default app