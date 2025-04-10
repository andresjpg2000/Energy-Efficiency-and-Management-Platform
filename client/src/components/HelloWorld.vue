<script>

  export default {
    data() {
      return {
        username: "",
      }
    },
    mounted() {

      // Testing data base connection
      fetch("http://localhost:3000/users/1")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        return response.json();
      })
      .then((user) => {
        this.username = user.nome;
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });

    }


  }


</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      
      Hello {{ username }}! <br>

    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
