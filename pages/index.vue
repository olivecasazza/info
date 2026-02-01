<template>
  <div class="flex flex-col w-full">
    <div class="text-2xl text-primary-300 rainbow-text-animated mt-2 mb-2">
      Olive Casazza
    </div>
    <div>
      <div class="text-xl text-primary-300">
        Contact
      </div>
      <span>email: <a class="link" href="mailto:olive@casazza.info">olive@casazza.info</a></span>
      <br>
      <span>git: <a class="link" href="https://github.com/olivecasazza">github.com/olivecasazza</a></span>
    </div>

    <br>
    <div>
      <div>
        <div class="text-xl text-primary-300">
          Experience
        </div>
        <ExperienceList />
      </div>
    </div>
    <br>
    <div>
      <div class="text-xl text-primary-300">
        Links
      </div>
      <ProjectsWrapper />
    </div>
    <div class="flex-grow" />
  </div>
</template>
