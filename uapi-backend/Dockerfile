FROM maven:3.8.4-openjdk-17-slim AS builder

WORKDIR /app

COPY . .

RUN mvn package

FROM openjdk:17-jdk

# Set the project version
ARG VERSION
ENV VERSION=${VERSION}

ENV JAR_FILE=api-hub-backend-${VERSION}.jar

#ENV JAR_FILE=api-hub-backend-1.0.0-SNAPSHOT.jar
ENV TARGET_JAR_FILE=api-hub-backend.jar
# Set the Profile
ARG PROFILE
RUN if [ -z "$PROFILE" ]; then export PROFILE="dev"; fi

COPY --from=builder /app/target/$JAR_FILE ./$TARGET_JAR_FILE

EXPOSE 8100
ENV JAVA_ARGS="-Dspring.profiles.active=$PROFILE"
CMD java $JAVA_ARGS -jar $TARGET_JAR_FILE