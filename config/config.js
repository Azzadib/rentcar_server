const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || "Your Secret Key",
    db_name: 'rentcar',
    db_username: 'postgres',
    db_password: 'admin'
}

export default config