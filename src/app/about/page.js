export default function AboutComponent() {
  return (
    <div className="flex flex-col p-4 min-h-screen text-primary">
      <div className="flex flex-col p-4 gap-4">
        <div className="text-3xl pb-8">About</div>
        <div className="text-2xl">To my friend who is watching this page.</div>
        <div>
          This application is a very simple demo. Not perfect but works well
          now. It helps me to record my leetcode. You can also use it, of course
          it&apos;s open source. But you really do lol?
        </div>
        <div>
          In July or August, or maybe later, I wanted to write a simple website
          or chrome plugin to record my leetcode. Now many months have passed
          and this application has been upgraded for many times. So do I.
        </div>
        <div>
          At first, it was written in Java Spring Boot. Deployed on a EC2 and
          the website was a static website on S3. It works at that time, but I
          wanted to learn something new. For example, the annoying Next.js.
        </div>
        <div>
          Next.js is a very powerful framework, easy to route the page, easy to
          deploy, but how can I make the best practice? I&apos;ve been thinking
          this for serveral months, but i&apos;m still confused. All I can do is
          to make demos and try. At first, I even don&apos;t know how to use
          context and ui library. But now I can. I also got some experiences to
          use client and server functions to render different part of my pages.
          I learned how to use nextauth, firebase, cognito to secure the api. I
          learned how to use serverless API and middlewire. I learned how to use
          GraphQL. I almost begin to like JavaScript. I don&apos;t need to
          create a heavy server like Spring Boot.
        </div>
        <ul className="flex flex-col gap-4">
          <div className="text-2xl">For those who wants to try this demo.</div>
          <li>
            clone this repo. Create a vercel account and deploy this project on
            vercel. Then create a Postgres database on your vercel dashboard.
            Set variables for your project.
          </li>
          <li>
            Oh you also need to create firebase project and use the
            authentication. I choose to login with email and password. Firebase
            only helps to secure API. The frontend, database, and apis are all
            in Vercel.
          </li>
          <li>You can also contact me for help. Thanks for watching!</li>
        </ul>
      </div>
    </div>
  );
}
