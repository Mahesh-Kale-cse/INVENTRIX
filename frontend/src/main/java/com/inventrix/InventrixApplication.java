package com.inventrix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class InventrixApplication {

    public static void main(String[] args) {
        SpringApplication.run(InventrixApplication.class, args);
        System.out.println("\n" +
                "  _____ _   ___     _______ _   _ _____ ____  _____  __\n" +
                " |_   _| \\ | \\ \\   / / ____| \\ | |_   _|  _ \\|_ _\\ \\/ /\n" +
                "   | | |  \\| |\\ \\ / /|  _| |  \\| | | | | |_) || | \\  / \n" +
                "   | | | |\\  | \\ V / | |___| |\\  | | | |  _ < | | /  \\ \n" +
                "   |_| |_| \\_|  \\_/  |_____|_| \\_| |_| |_| \\_\\___/_/\\_\\\n" +
                "\n");
        System.out.println("🚀 INVENTRIX Backend is running on http://localhost:8080");
        System.out.println("📚 API Documentation: http://localhost:8080/swagger-ui.html");
        System.out.println("🔌 WebSocket Endpoint: ws://localhost:8080/ws");
    }
}
