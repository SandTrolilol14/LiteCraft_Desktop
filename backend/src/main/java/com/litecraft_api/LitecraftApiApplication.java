package com.litecraft_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.litecraft_api.repository")
@EntityScan(basePackages = "com.litecraft_api.model")
public class LitecraftApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(LitecraftApiApplication.class, args);
	}
}