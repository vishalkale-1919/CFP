# Stage 1: Build compilation wrapper
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: High-performance execution runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S ecosys && adduser -S ecosys -G ecosys
USER ecosys
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
ENV JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75.0"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]