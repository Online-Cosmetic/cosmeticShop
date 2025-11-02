# ---------- Simple Spring Boot Run Image ----------
FROM openjdk:17-jdk-slim
WORKDIR /app

# 이미 빌드된 jar를 복사
COPY build/libs/*.jar app.jar

# 환경 설정
EXPOSE 9000

# 실행 명령
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

