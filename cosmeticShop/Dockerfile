FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY build/libs/*SNAPSHOT.jar app.jar
EXPOSE 9000
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

