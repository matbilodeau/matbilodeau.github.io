---
title: "Free website on Github Pages"
subtitle: How to create your site on Github Pages and publish it to your .dev domain
date: 2026-09-14
---

# The story part

I had been thinking about registering a domain for a custom email address. I was looking for an easy to remember name that would look professionnal without necessarily going for a common [TLD][0] such as _.com_. _.ca_, etc. Having a Google account and knowing they offer a registrar service, I had a look.  That's how I came across the [.dev][1] [TLD][0].

![Good marketing here](/img/Gdomain.png)

Marketing dept's doing its job well so I clicked that attractive button.  If you want to serve a website through this domain, you'll need an SSL certificate.  No worries there, plus it's a cool name, it's affordable and it will require that I setup HTTPS when I'm ready for a website (and also requires visitors to use a secure protocol).

I had come across a site hosted on Github for the first time a few years back and figured it was automatically generated from _.md_ files within the repo. I tought [Github Pages][2] would be an interesting option when I'd want a small website to show off my repos.

So I'm doing this presentation for a cloud computing course and while presenting Github's features, I was showing how you could use it to showcase your skills to potential employers and link it on your CV. Someone throws "Why isn't yours on Github then?"

![Challenge Accpeted](/img/challengeAccepted.jpg)

# How to
## keep your sanity when dealing with Google Domains
If you enjoy a cleansed browsing experience though the use of extensions/plug-ins, some of Google Domains' features may seem broken. The cases I experienced were:
* DNS A Record not accepting all the IP adresses and reverting to the first line only, even after using the + sign on creation, using the edit button and then the + sign to add more failed, deleting the record and waiting for the TTL to expire didn't change anything either.
* CNAME always fell back to mydomain.dev instead of user.github.io even after trying the common troubleshooting listed previously.

### **Use private browsing or incognito mode**
I know it doesn't make sense as a solution to apparent DNS issues but it worked for me.

# Procedure
You will need:
* A Github account
* A registered domain
  * if your domain is not "More Secure", you can still follow these instructions.

The [Github Pages][2] docs make you create a repo like `user.github.io` but you can activate [Github Pages][2] in any repo through the _Settings_ menu. However, Github can only have one custom entry per repo, either Apex or subdomain but not both. So you cant have www.domain.xxx and domain.xxx redirect to the same repo. There are inelegant workaround methods but I won't deal with that here. Just choose how *you* think is best. I decided to go with the _Apex_ domain and use subdomains for specific repos, like [this one][3].

Want to use the _Apex_? Just create an _A RECORD_ in Google Domains DNS with the IP adresses listed [here][4].
Want to use a subdomain instead? Create a [CNAME][5] file (steps 1 2 3, use full _sub.domain.xxx_) in your repo and go to Google Domains DNS and add a CNAME entry _sub_ that directs to `user.github.io`.

![GoogleDNS](/img/GoogleDomainsDNS.png)

Once your done with the Google Domains part, go back to your repo's Settings and *wait patiently* until the error message next to the _Enforce HTTP_ checkbox goes away. DNS propagation can take a while, you might see a change in minutes but it could also take hours. [Github Pages][2] automatically generates free certificates through *Let's Encrypt*. If you pay attention to the Settings page you might even see a progress bar when the certificate is generated. When everything is ready you should see "Your site is now published at https://...."

# Security
The main benefit of `.dev` domains, on top being really really really ridiculously good looking, is that it commes out of the box with  [HSTS][6] pre-loading enabled. This makes sure all connections to your site are secure. If you want to enable HSTS on a domain you own, just follow these [instructions][7].


[0]: https://en.wikipedia.org/wiki/Top-level_domain
[1]: https://get.dev/#benefits
[2]: https://pages.github.com
[3]: https://aucun-probleme.matbilodeau.dev/
[4]: https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain
[5]: https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages/managing-a-custom-domain-for-your-github-pages-site#configuring-a-subdomain
[6]: https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security
[7]: https://hstspreload.org/
