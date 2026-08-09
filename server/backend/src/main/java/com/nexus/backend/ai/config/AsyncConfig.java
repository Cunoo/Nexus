package com.nexus.backend.ai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "translationTaskExecutor")
    public Executor translationTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);        // 5 baseline threads always ready
        executor.setMaxPoolSize(20);       // Max 20 threads under heavy load
        executor.setQueueCapacity(500);    // Queue up to 500 tasks before rejecting
        executor.setThreadNamePrefix("AsyncTrans-");
        executor.initialize();
        return executor;
    }
}