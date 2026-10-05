@echo off
set "JAVA_HOME=C:\Users\munde\jdk17\jdk-17.0.10+7"
set "M2_HOME=C:\Users\munde\mvn\apache-maven-3.9.6"
set "PATH=%JAVA_HOME%\bin;%M2_HOME%\bin;%PATH%"

echo =========================================
echo Building InterviewAI Spring Boot Backend
echo JAVA_HOME: %JAVA_HOME%
echo M2_HOME:   %M2_HOME%
echo =========================================

java -version
call mvn -version
call mvn clean install -DskipTests=false
