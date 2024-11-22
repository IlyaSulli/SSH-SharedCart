public class Credentials {
    //JDBC connection
    public static final String USERNAME = "postgres";
    public static final String PASSWORD = "Ollivanders123";
    public static final String URL = "jdbc:postgresql://localhost:5432/clientOrderDB";
    //Client-server connection
    public static final String HOST = "127.0.0.1"; //localhost
    public static final int PORT = 9994; //This is NOT the port in postgres, but the port at which the RecordsDatabaseServer is listening
    public static final int MAXUSERS = 10;
    public static final String shoppingCartFileAddress = "C:\\Users\\hecto\\IdeaProjects\\SSHProject\\src\\main\\java\\shopping.json";

}