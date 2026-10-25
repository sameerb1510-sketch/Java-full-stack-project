FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B -Prender-postgres -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/gym-membership-1.0.0.jar app.jar
COPY start.sh ./start.sh
RUN chmod +x /app/start.sh
EXPOSE 10000
ENTRYPOINT ["/app/start.sh"]
