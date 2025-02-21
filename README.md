# Step 1
run /docs/db/script.sql script

# Step 2
Generate your own session secret (replace later into SESSION_SECRET env variable)
node -e "console.log(crypto.randomBytes(32).toString('hex'))"

# Step 3
rename .env.example to .env & set your own data
