# Imagen del backend para desplegar en Render (o cualquier servicio con Docker).
# 1) Compila con Maven  2) Ejecuta solo el .jar con Java 17.
FROM maven:3.9.9-eclipse-temurin-17 AS compilacion
WORKDIR /app
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
COPY src ./src
RUN mvn -q -B package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=compilacion /app/target/artmatrix-api-*.jar app.jar
ENV JAVA_OPTS="-Xmx384m"
EXPOSE 8080
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
