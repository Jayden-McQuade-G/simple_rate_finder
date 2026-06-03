
using MySqlConnector;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//app.UseHttpsRedirection(); Unnecessary in dev

//Hard coded db connection details
string connectionString =
    "server=localhost;Database=srf_db;User ID=root;Password=root;";

//Used to test database connection is functional
app.MapGet("/test-db", async () =>
{
    try
    {
        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();

        return Results.Ok("Connection successful");
    }
    catch (MySqlException ex)
    {
        return Results.Problem($"MySQL error: {ex.Message}");
    }
    catch (Exception ex)
    {
        return Results.Problem($"General error: {ex.Message}");
    }
})
.WithName("test-db");

//Retrieve all savings accounts for a specific user
app.MapGet("/customer-accounts/{customerId:int}", async (int customerId) =>
{
    try
    {
        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();

        const string sql = @"
            SELECT
                ca.customer_account_id,
                ca.account_name,
                ca.balance,
                ma.account_name  AS market_account_name,
                ma.company_name,
                ma.interest_rate
            FROM customer_account ca
            INNER JOIN market_account ma
                ON ca.market_account_id = ma.market_account_id
            WHERE ca.customer_id = @customerId";

        await using var command = new MySqlCommand(sql, connection);
        command.Parameters.AddWithValue("@customerId", customerId);

        await using var reader = await command.ExecuteReaderAsync();

        var accounts = new List<object>();

        while (await reader.ReadAsync())
        {
            accounts.Add(new
            {
                customerAccountId = reader.GetInt32(reader.GetOrdinal("customer_account_id")),
                marketAccountName = reader.GetString(reader.GetOrdinal("market_account_name")),
                companyName       = reader.GetString(reader.GetOrdinal("company_name")),
                interestRate      = reader.GetDecimal(reader.GetOrdinal("interest_rate")),
                accountName       = reader.GetString(reader.GetOrdinal("account_name")),
                balance           = reader.GetDecimal(reader.GetOrdinal("balance")),
            });
        }

        if (accounts.Count == 0)
            return Results.NotFound("No accounts found.");

        return Results.Ok(accounts);
    }
    catch (MySqlException ex)
    {
        return Results.Problem($"MySQL error: {ex.Message}");
    }
    catch (Exception ex)
    {
        return Results.Problem($"General error: {ex.Message}");
    }
})
.WithName("customer-accounts");

//Retrieve all savings accounts for a specific user
app.MapGet("/all-customers", async () =>
{
    await using var connection = new MySqlConnection(connectionString);
    await connection.OpenAsync();

    const string sql = "SELECT customer_id, name FROM customer";

    await using var command = new MySqlCommand(sql, connection);
    await using var reader = await command.ExecuteReaderAsync();

    var customers = new List<object>();

    while (await reader.ReadAsync())
    {
        customers.Add(new
        {
            customerId = reader.GetInt32("customer_id"),
            name = reader.GetString("name")
        });
    }

    return Results.Ok(customers);
})
.WithName("all-customers");


//Returns the savings account with the highest interest rate
app.MapGet("/best-savings-account", async () =>
{
    try
    {
        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();

        const string sql = @"
            SELECT *
            FROM market_account
            ORDER BY interest_rate DESC
            LIMIT 1";

        await using var command = new MySqlCommand(sql, connection);

        await using var reader = await command.ExecuteReaderAsync();

        if (!await reader.ReadAsync())
            return Results.NotFound("No savings accounts found.");

        var account = new
        {
            marketAccountId = reader.GetInt32(reader.GetOrdinal("market_account_id")),
            accountName = reader.GetString(reader.GetOrdinal("account_name")),
            companyName = reader.GetString(reader.GetOrdinal("company_name")),
            interestRate = reader.GetDecimal(reader.GetOrdinal("interest_rate")),
            updatedAt = reader.GetDateTime(reader.GetOrdinal("updated_at"))
        };

        return Results.Ok(account);
    }
    catch (MySqlException ex)
    {
        return Results.Problem($"MySQL error: {ex.Message}");
    }
    catch (Exception ex)
    {
        return Results.Problem($"General error: {ex.Message}");
    }
})
.WithName("best-savings-account");

//Recieves the updated account details, and inserts them into the database. -- Not yet Used
app.MapPost("/update-account", async (UpdateAccountRequest account) =>
{
    try
    {
        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();

        const string sql = @"
            UPDATE customer_account
            SET
                market_account_id = @marketAccountId,
                balance = @balance,
                account_name = @accountName
            WHERE customer_account_id = @customerAccountId";

        await using var command = new MySqlCommand(sql, connection);

        command.Parameters.AddWithValue("@customerAccountId", account.CustomerAccountId);
        command.Parameters.AddWithValue("@marketAccountId", account.MarketAccountId);
        command.Parameters.AddWithValue("@balance", account.Balance);
        command.Parameters.AddWithValue("@accountName", account.AccountName);

        var rowsAffected = await command.ExecuteNonQueryAsync();

        if (rowsAffected == 0)
            return Results.NotFound("Account not found.");

        return Results.Ok("Account updated successfully.");
    }
    catch (MySqlException ex)
    {
        return Results.Problem($"MySQL error: {ex.Message}");
    }
    catch (Exception ex)
    {
        return Results.Problem($"General error: {ex.Message}");
    }
})
.WithName("update-account");

app.Run();

public record CompareAccountsRequest(
    decimal AccountAInterestRate,
    decimal AccountBInterestRate
);
public record UpdateAccountRequest(
    int CustomerAccountId,
    int MarketAccountId,
    decimal Balance,
    string AccountName
);
