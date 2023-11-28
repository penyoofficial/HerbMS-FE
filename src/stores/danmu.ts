import { ref } from "vue";
import { defineStore } from "pinia";
import { shuffle } from "lodash";

export const useDanmuStore = defineStore("danmu", () => {
  const danmuku = ref([
    "JavaScript",
    "TypeScript",
    "Node.js",
    "Vue.js",
    "Java SE",
    "Maven",
    "Jakarta EE",
    "JDBC",
    "MyBatis",
    "React",
    "Angular",
    "Python",
    "Django",
    "Flask",
    "Ruby",
    "Ruby on Rails",
    "PHP",
    "Laravel",
    "Symfony",
    "ASP.NET",
    "C#",
    "ASP.NET MVC",
    "ASP.NET Core",
    "Spring Framework",
    "Spring Boot",
    "Hibernate",
    "JUnit",
    "JUnit Jupiter",
    "JUnit Vintage",
    "TestNG",
    "RESTful",
    "GraphQL",
    "SOAP",
    "API",
    "JSON",
    "XML",
    "HTML",
    "CSS",
    "SASS",
    "LESS",
    "Bootstrap",
    "Tailwind CSS",
    "Git",
    "GitHub",
    "GitLab",
    "Bitbucket",
    "Docker",
    "Kubernetes",
    "Jenkins",
    "Travis CI",
    "CircleCI",
    "AWS",
    "Azure",
    "Google Cloud",
    "Firebase",
    "MongoDB",
    "MySQL",
    "PostgreSQL",
    "SQLite",
    "Redis",
    "Elasticsearch",
    "Apache Kafka",
    "RabbitMQ",
    "Nginx",
    "Apache HTTP Server",
    "WebSocket",
    "TCP/IP",
    "DNS",
    "SSL/TLS",
    "OAuth",
    "JWT",
    "OAuth2",
    "Single Sign-On (SSO)",
    "Microservices",
    "Serverless",
    "DevOps",
    "Agile",
    "Scrum",
    "Kanban",
    "Continuous Integration (CI)",
    "Continuous Delivery (CD)",
    "Machine Learning",
    "Artificial Intelligence",
    "Natural Language Processing (NLP)",
    "Computer Vision",
    "Big Data",
    "Data Science",
    "Data Engineering",
    "Blockchain",
    "Internet of Things (IoT)",
    "Augmented Reality (AR)",
    "Virtual Reality (VR)",
    "Cybersecurity",
    "Penetration Testing",
    "Ethical Hacking",
    "Cryptocurrency",
    "Quantum Computing",
    "Edge Computing",
    "Robotics",
    "Autonomous Vehicles",
  ]);

  /**
   * 获取弹幕包。
   */
  function getDanmus(amount: number) {
    return shuffle(danmuku.value).slice(0, amount);
  }

  return { getDanmus };
});
