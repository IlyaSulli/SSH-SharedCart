import java.net.Socket;

import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;

public class SSHClient {
    private Socket clientSocket = null;
    public void intialiseSocket() {
        try {
            clientSocket = new Socket(Credentials.HOST, Credentials.PORT); // Create Socket for Client and connect to Server
        } catch (Exception e) {
            System.out.println("Client: Error " + e);
            System.exit(1);
        }
    }

    public void requestServer(char command, int itemId, int quantity) {
        try {
            OutputStream requestStream = this.clientSocket.getOutputStream();
            OutputStreamWriter requestStreamWriter = new OutputStreamWriter(requestStream);
            if (command != 'A') {
                requestStreamWriter.write(command + ";" + "#");
            } else {
                requestStreamWriter.write(command + ";" + itemId + ":" + quantity + "#");
            }
            requestStreamWriter.flush();
        } catch (IOException e) {
            System.out.println("Client: I/O Error " + e);
            System.exit(1);
        }
    }

    public void reportServiceOutcome() {
        try {
            //TO BE COMPLETED
            String tmp = "";
            InputStream outcomeStream = this.clientSocket.getInputStream();
            //ObjectInputStream outcomeStreamReader = new ObjectInputStream(outcomeStream);
            //this.serviceOutcome = (CachedRowSet) outcomeStreamReader.readObject();
        } catch (Exception e) {
            System.out.println("Client: I/O Error " + e);
            System.exit(1);
        }
    }
    public static void main(String args[]) {
        try {
            SSHClient client = new SSHClient();
            client.intialiseSocket();
            client.requestServer('D', 2, 10);
            client.clientSocket.close();
        } catch (Exception e) {
            System.out.println("Client: I/O Error " + e);
            System.exit(1);
        }

    }
}