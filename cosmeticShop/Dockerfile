# ---------- Build stage ----------
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

# Gradle 관련 파일 복사
COPY gradlew gradlew
COPY gradle gradle
COPY build.gradle settings.gradle ./

# Gradle wrapper 실행 권한 부여 + 의존성 캐시
RUN chmod +x gradlew && ./gradlew --no-daemon dependencies || true

# 나머지 소스 전체 복사
COPY . .
RUN chmod +x gradlew

# JAR 빌드
RUN ./gradlew --no-daemon clean bootJar -x test

# ---------- Run stage ----------
FROM eclipse-temurin:17-jre
WORKDIR /app

RUN useradd -ms /bin/bash spring && chown -R spring:spring /app
USER spring

# jar 파일 복사
COPY --from=build /app/build/libs/*.jar /app/app.jar

EXPOSE 9000
ENV JAVA_OPTS="" SPRING_OPTS=""

ENTRYPOINT ["/bin/sh","-c","exec java $JAVA_OPTS -jar /app/app.jar $SPRING_OPTS"]
