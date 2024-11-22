import javax.sql.rowset.CachedRowSet;
import javax.sql.rowset.RowSetFactory;
import javax.sql.rowset.RowSetProvider;
import java.io.*;
import java.net.Socket;
import java.sql.*;
import java.util.Arrays;
import java.util.Objects;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import java.io.FileWriter;

public class SSHService extends Thread { // This Class is ran as a thread
    private Socket serviceSocket = null;
    // For JDBC Connection
    private String USERNAME = Credentials.USERNAME; // Username for PSQL taken from Credentials File
    private String PASSWORD = Credentials.PASSWORD; // Password for PSQL taken from Credentials File
    private String URL = Credentials.URL; // URL of database for PSQL taken from Credentials File
    private ResultSet outcome = null; // Output of querying the database
    private String[] requestStr = new String[2]; // One slot for first arg, one slot for second arg (e.g. itemId and Quantity) if needed
    private char codeLetter; // Uses a letter to inform which function to run -> (E.g. A = updateQuantity)
    // Class Constructor
    public SSHService(Socket var1) {
        serviceSocket = var1;
    }

    public String[] retrieveRequest() { // Retrieving Request from Client
        String tmp = "";
        this.requestStr[0] = "";
        this.requestStr[1] = "";
        char checkingChar; // The current cursor
        StringBuffer stringBuffer = new StringBuffer();
        try {
            System.out.println("Retrieving");
            InputStream socketStream = this.serviceSocket.getInputStream(); // Get input from client
            InputStreamReader socketReader = new InputStreamReader(socketStream);
            boolean finishedCheck = false; // Flag to see if input has been finished reading

            while (!finishedCheck) { // Waits till cursor is at end of line
                checkingChar = (char) socketReader.read();
                if (checkingChar == ':') { // This is read after each argument
                    this.requestStr[0] = stringBuffer.toString();
                    stringBuffer.delete(0, stringBuffer.length());
                } else if (checkingChar == ';') { // This is read after the keycode letter
                    this.codeLetter = stringBuffer.toString().charAt(0);
                    stringBuffer.delete(0, stringBuffer.length());
                } else if (checkingChar == '#') { // This is read at the end of line
                    this.requestStr[1] = stringBuffer.toString();
                    finishedCheck = true;
                } else { // Anything else will just be appended
                    stringBuffer.append(checkingChar);
                }
            }
        } catch (IOException e) {
            System.out.println("Service thread " + 3 + ": " + e);
            System.exit(1);
        }
        return this.requestStr;
    }

    public boolean attendRequest() { // Choose which function to run
        boolean flagRequestAttended = true;
        switch (this.codeLetter) {
            case 'A':
                this.updateQuantity();
                break;
            case 'B':
                this.deleteItem();
                break;
            case 'C':
                this.updateStatus();
                break;
            case 'D':
                this.getListOfItems();
                break;
            case 'E':
                this.getListOfShops();
                break;
        }
        return true;
    }

    // Request Update to Quantity
    public void updateQuantity() {
        String sql = "";
        try {
            Class.forName("org.postgresql.Driver");
            Connection conn = DriverManager.getConnection(this.URL, this.USERNAME, this.PASSWORD);

            // Make Request
            sql = "UPDATE peopleItems SET Quantity = ? WHERE PersonId = ? AND itemId = ?;"; // Change the Quantity of a specific Item for a person
            PreparedStatement stmt = conn.prepareStatement(sql);

            stmt.setInt(1, Integer.parseInt(requestStr[1])); // Set Values based on input from function
            stmt.setInt(3, Integer.parseInt(requestStr[0]));
            stmt.setInt(2, 1);
            stmt.executeUpdate();
            stmt.close();
            conn.close();
            System.out.println("Successfully updated quantity: " + requestStr[1]);
        } catch (Exception e) {
            System.out.println("Update Quantity: " + e);
            System.exit(1);
        }
    }

    // Request removal of Item
    public void deleteItem() {
        String sql = "";
        try {
            System.out.println("DELETE ITEM");
            Class.forName("org.postgresql.Driver");
            Connection conn = DriverManager.getConnection(this.URL, this.USERNAME, this.PASSWORD);
            sql = "DELETE FROM peopleItems WHERE ItemId = ? AND personId = ?;"; // Delete specific item for the specific person
            PreparedStatement stmt = conn.prepareStatement(sql);

            stmt.setInt(1, Integer.parseInt(requestStr[1])); // Set values based on function arguments
            stmt.setInt(2, 1);
            stmt.executeUpdate();
            stmt.close();
            conn.close();
            System.out.println("Successfully deleted Item");
        } catch (Exception e) {
            System.out.println("Delete Item: " + e);
            System.exit(1);
        }
    }
    // Update Confirm status for order for user
    public void updateStatus() {
        this.outcome = null; // Output
        boolean statusString = false; // Temporary status flag, this will be set to the current status of the order
        String sql = "";
        try {
            System.out.println("UPDATING STATUS");
            Class.forName("org.postgresql.Driver");
            Connection conn = DriverManager.getConnection(this.URL, this.USERNAME, this.PASSWORD);
            sql = "SELECT orderStatus FROM people WHERE PersonId = ?;"; // Get the confirm status boolean from this person
            PreparedStatement stmt = conn.prepareStatement(sql);

            stmt.setInt(1, 1);
            ResultSet rs = stmt.executeQuery();

            RowSetFactory aFactory = RowSetProvider.newFactory();
            CachedRowSet crs = aFactory.createCachedRowSet();
            crs.populate(rs);

            this.outcome = crs;
            while (outcome.next()) {
                statusString = this.outcome.getBoolean("orderStatus"); // Set StatusString to be current status
            }
            sql = "UPDATE people SET orderStatus = ? WHERE PersonId = ?;";
            PreparedStatement stmt2 = conn.prepareStatement(sql);
            stmt2.setInt(2, 1);
            System.out.println(statusString);
            if (statusString) { // Set new status based on the reverse of the current status
                stmt2.setBoolean(1, false);
                statusString = false;
            } else {
                stmt2.setBoolean(1, true);
                statusString = true;
            }
            stmt2.executeUpdate();
            stmt.close();
            conn.close();
            stmt2.close();
            System.out.println("Successfully updated status: " + statusString);
        } catch (Exception e) {
            System.out.println("Update Status: " + e);
            System.exit(1);
        }
    }
    // Send list of items in cart and write to json file
    public void getListOfItems() {
        // Extract data from tables
        int[] userIds = new int[Credentials.MAXUSERS]; // Creates array which will store which personIds there are currently in the database with a maximum size
        int temp = 0; // An indexing variable to store the peopleId in userIds
        this.outcome = null;
        String sql = "";
        JSONObject jsonObject = new JSONObject(); // The JSON Object that will be written to the JSON file
        try {
            System.out.println("Getting List of Items");
            Class.forName("org.postgresql.Driver");
            Connection conn = DriverManager.getConnection(this.URL, this.USERNAME, this.PASSWORD);
            sql = "SELECT PersonId FROM people"; // Gets all the current personIds in the database
            PreparedStatement stmt = conn.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();

            RowSetFactory aFactory = RowSetProvider.newFactory();
            CachedRowSet crs = aFactory.createCachedRowSet();
            crs.populate(rs);

            this.outcome = crs;
            while (outcome.next()) {
                userIds[temp] = this.outcome.getInt("PersonId"); // Adds all the personIds to an index in the array to be used later
                temp++;
            }
            System.out.println(Arrays.toString(userIds)); // Testing

            for (int i = 0; i < userIds.length; i++) { // Iterates through the UserIds
                if (userIds[i] == 0) { // If less than 10 userIds, then it will exit the for loop at the end of the list (saves time)
                    break;
                }
                System.out.println("Start loop"); // Testing
                // Sql command gets all data needed from the database for the current personId to be used in JSON
                sql = "SELECT PersonName, peopleItems.ItemId, ItemName, ItemDescription, ImageLink, ItemCost, Quantity FROM people, items, peopleItems WHERE peopleItems.PersonId = people.PersonId AND peopleItems.ItemId = items.ItemId AND peopleItems.PersonId = ?;";
                PreparedStatement stmt2 = conn.prepareStatement(sql);

                stmt2.setInt(1, userIds[i]);
                ResultSet rs2 = stmt2.executeQuery();

                RowSetFactory aFactory2 = RowSetProvider.newFactory();
                CachedRowSet crs2 = aFactory2.createCachedRowSet();
                crs2.populate(rs2);
                this.outcome = crs2;
                JSONArray jsonArray = new JSONArray(); // Creates Array which will store each JSON Item Object for this person's cart
                JSONObject jsonObjectCart = new JSONObject(); // Creates the object which will store the array of this person's cart
                while (outcome.next()) { // Iterates through items and stores them in an array of JSONObjects
                    jsonObjectCart.put("name", outcome.getString("PersonName"));
                    JSONObject jsonObjectItems = new JSONObject();
                    jsonObjectItems.put("ItemId", outcome.getInt("ItemId"));
                    jsonObjectItems.put("name", outcome.getString("ItemName"));
                    jsonObjectItems.put("description", outcome.getString("ItemDescription"));
                    jsonObjectItems.put("imageLink", outcome.getString("ImageLink"));
                    jsonObjectItems.put("cost", outcome.getFloat("ItemCost"));
                    jsonObjectItems.put("quantity", outcome.getInt("Quantity"));
                    jsonArray.add(jsonObjectItems); // Adds these values into the Array as a JSONObject
                }
                jsonObjectCart.put("cart", jsonArray);  // Stores the array within a JSONObject labelled "Cart"
                jsonObject.put(userIds[i], jsonObjectCart); // Stores the cart within each user
                stmt2.close();
            }
            try {
                FileWriter file = new FileWriter("itemList.json");
                file.write(jsonObject.toJSONString()); // Writes this object into the JSON file that is located at the address above
                file.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
            stmt.close();
            conn.close();
            System.out.println("Successfully outputted list of Items");
        } catch (Exception e) {
            System.out.println("Getting List of Items: " + e);
            System.exit(1);
        }
    }

    // Send list of shops
    public void getListOfShops() {
        String sql = "";
        JSONObject jsonObject = new JSONObject();
        try {
            System.out.println("Getting List of Shops");
            Class.forName("org.postgresql.Driver");
            Connection conn = DriverManager.getConnection(this.URL, this.USERNAME, this.PASSWORD);

            sql = "SELECT * FROM shops;";
            PreparedStatement stmt = conn.prepareStatement(sql);

            ResultSet rs = stmt.executeQuery();

            RowSetFactory aFactory = RowSetProvider.newFactory();
            CachedRowSet crs = aFactory.createCachedRowSet();
            crs.populate(rs);
            this.outcome = crs;
            while (outcome.next()) {
                JSONObject jsonObjectShop = new JSONObject();
                jsonObjectShop.put("name", outcome.getString("ShopName"));
                jsonObjectShop.put("delivery_price", outcome.getFloat("DeliveryPrice"));
                jsonObjectShop.put("logo", outcome.getString("DeliveryLogo"));
                jsonObjectShop.put("color", outcome.getString("Colour"));
                jsonObject.put(outcome.getInt("ShopId"), jsonObjectShop);
            }
            try {
                FileWriter file = new FileWriter("shops.json");
                file.write(jsonObject.toJSONString()); // Writes this object into the JSON file that is located at the address above
                file.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
            stmt.close();
            conn.close();
            System.out.println("Successfully outputted list of Shops");
        } catch (Exception e) {
            System.out.println("Getting List of Shops: " + e);
            System.exit(1);
        }
    }

    public void returnServiceOutcome() {
        try {

            //Return outcome
            //TO BE COMPLETED
            //ObjectOutputStream outcomeStreamWriter = new ObjectOutputStream(serviceSocket.getOutputStream());
            //outcomeStreamWriter.writeObject(this.outcome);
            System.out.println("Service thread " + this.getId() + ": Service outcome returned; " + this.outcome);
            //Terminating connection of the service socket
            //TO BE COMPLETED
            serviceSocket.close();
        } catch (IOException e) {
            System.out.println("Service thread " + this.getId() + ": " + e);
            System.exit(1);
        }
    }

    public void run() {
            this.retrieveRequest();
            System.out.println("Service thread " + 0 + ": Request retrieved: " + "firstArg->" + this.requestStr[0] + "; secondArg->" + this.requestStr[1]);
            boolean tmp = this.attendRequest();
            if (!tmp) {
                System.out.println("Service thread " + this.getId() + ": Unable to provide service.");
            }
            this.returnServiceOutcome();
        System.out.println("Service thread " + this.getId() + ": Finished service.");
        }
}