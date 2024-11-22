import java.net.Socket;
import java.net.ServerSocket;
import java.net.InetAddress;


public class SSHServer {
    private int thePort = 0;
    private String theIPAddress = null;
    private ServerSocket serverSocket = null;
    public boolean orderStatus = false;

    public SSHServer() {

        thePort = Credentials.PORT; // Takes Port from Credentials File
        theIPAddress = Credentials.HOST; //Takes Ip from Credentials File


        System.out.println("Server: Initialising server socket at " + this.theIPAddress + " with listening port " + this.thePort);

        try {
            // Initialise socket

            int maxConnectionsQueue = 3; // Max number of clients connected at any one time (temp Number)
            this.serverSocket = new ServerSocket(this.thePort, maxConnectionsQueue, InetAddress.getByName(this.theIPAddress)); // Creates Server Socket based on port and ipAddress with a max number of clients allowed
            System.out.println("Server: Server at " + this.theIPAddress + " is listening on port : " + this.thePort);
        } catch (Exception var2) {
            System.out.println("Server Constructor: " + var2); // Creation of Server Socket Failed
            System.exit(1);
        }
    }

    // Runs Service Loop
    public void executeServiceLoop() {
        System.out.println("Server: Start Service Loop.");

        try {
            while (true) {
                System.out.println("Server: Waiting for incoming connection...");
                Socket aSocket = this.serverSocket.accept(); // Waiting for a client to connect
                Thread var1 = new Thread(new SSHService(aSocket)); // Creates a thread for that specific client
                var1.start(); // Starts thread
                System.out.println("Server: Finished Thread");
            }
        } catch (Exception e) {
            System.out.println("Exception: " + e);
        }
        System.out.println("Server: Finished Service Loop");
    }


    public static void main(String args[]) {
        SSHServer server = new SSHServer();
        server.executeServiceLoop();
        System.out.println("Server: Finished");
        System.exit(0);
    }
}