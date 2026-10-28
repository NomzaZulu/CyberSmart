
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const panel = document.getElementById('activityPanel');
  const backdrop = document.getElementById('backdrop');
  const panelTitle = document.getElementById('panelTitle');
  const panelContent = document.getElementById('panelContent');
  const closePanel = document.getElementById('closePanel');
  const toast = document.getElementById('toast');

  if (!panel || !panelTitle || !panelContent) {
    console.error(
      'CyberSmart: Activity panel elements are missing. Check index.html IDs.'
    );
    return;
  }

  let toastTimer;
  let activityState = null;

  const ageContent = {
    young: {
      spotTitle: 'Spot the Tricky Message',
      spotIntro: 'Imagine you receive this message while playing a game.',
      spotMessage:
        'YOU WON A FREE TOY! 🎁 Click this strange link and tell us your secret password!',
      spotQuestion: 'What is the safest choice?',
      spotOptions: [
        ['ignore', 'Ignore the message and tell a trusted adult'],
        ['click', 'Click the link to get the toy'],
        ['password', 'Tell the sender your password']
      ],
      spotCorrect: 'ignore',
      spotExplanation:
        'Correct! Unexpected gifts and requests for secret information can be tricks. Never share your password. Ask a trusted adult for help.',
      scenarioTitle: 'A Stranger in Your Game',
      scenarioIntro:
        'Someone you do not know online asks where you live so they can send you a gift.',
      scenarioOptions: [
        ['safe', 'Keep your address private and tell a trusted adult'],
        ['unsafe', 'Tell them your full address'],
        ['unsafe', 'Send them a photo of your house']
      ],
      scenarioExplanation:
        'Correct! Keep your home address and other private information secret. A trusted adult can help you decide what to do.',
      toolkitIntro: 'Three important rules for younger students',
      toolkitExtra: [
        'Ask a trusted adult before clicking a strange link.',
        'Never share passwords, OTPs, your address, or school details with strangers online.',
        'If something online makes you worried, stop and tell a trusted adult.'
      ]
    },

    middle: {
      spotTitle: 'Spot the Gaming Scam',
      spotIntro: 'You receive this message from an unknown gaming account.',
      spotMessage:
        'FREE 5,000 GAME COINS! Claim in 3 minutes. Log in using this link and enter your password.',
      spotQuestion: 'Which response is safest?',
      spotOptions: [
        [
          'safe',
          'Ignore the link and check only through the official game app or website'
        ],
        ['unsafe', 'Log in quickly before the offer expires'],
        [
          'unsafe',
          'Forward the link to friends so they can claim coins too'
        ]
      ],
      spotCorrect: 'safe',
      spotExplanation:
        'Correct! Urgency, free rewards, unknown links, and password requests are warning signs. Check offers using the official game platform.',
      scenarioTitle: 'The Group Chat Problem',
      scenarioIntro:
        'Classmates share an embarrassing photo of another student in a group chat. People are laughing and asking you to forward it.',
      scenarioOptions: [
        [
          'safe',
          'Do not forward it, support the student, and tell a trusted adult if needed'
        ],
        ['unsafe', 'Forward it because everyone else is doing it'],
        ['unsafe', 'Add an insulting caption']
      ],
      scenarioExplanation:
        'Correct! Do not spread humiliating content. Support the person targeted and report bullying to a trusted adult or teacher.',
      toolkitIntro: 'Practical rules for middle-school students',
      toolkitExtra: [
        'Use unique passwords and never share an OTP.',
        'Check privacy settings and think before posting photos or personal details.',
        'Block and report suspicious accounts or cyberbullying, and seek help.'
      ]
    },

    older: {
      spotTitle: 'Analyse a Phishing Attempt',
      spotIntro: 'You receive an email claiming to be from a service you use.',
      spotMessage:
        'URGENT: Your account will be suspended today. Verify your login through the link below immediately or lose access.',
      spotQuestion: 'What should you do first?',
      spotOptions: [
        [
          'safe',
          'Avoid the link and check your account directly through the official app or website'
        ],
        [
          'unsafe',
          'Click the link and enter your credentials to prevent suspension'
        ],
        ['unsafe', 'Reply with your password to confirm your identity']
      ],
      spotCorrect: 'safe',
      spotExplanation:
        'Correct! Threats of account suspension create urgency. Do not trust a link just because the message looks official. Navigate to the service independently and report suspicious messages.',
      scenarioTitle: 'A Possible Impersonation Scam',
      scenarioIntro:
        'An account using your school principal’s name messages you from an unfamiliar number. It asks you to buy gift cards urgently and keep it confidential.',
      scenarioOptions: [
        [
          'safe',
          'Verify through a separate, trusted channel and alert the school if suspicious'
        ],
        ['unsafe', 'Buy the cards because the name looks familiar'],
        ['unsafe', 'Reply asking which gift card codes they prefer']
      ],
      scenarioExplanation:
        'Correct! A familiar name or photo does not prove identity. Urgency, secrecy, and unusual payment requests are red flags. Verify independently before acting.',
      toolkitIntro: 'Practical rules for senior students',
      toolkitExtra: [
        'Inspect the full domain carefully; look for misspellings and misleading subdomains.',
        'Use unique passwords, a password manager where appropriate, and multifactor authentication.',
        'Preserve relevant evidence safely, report suspicious accounts, and use official reporting channels.'
      ]
    }
  };

  // Four additional questions per activity.
  // Together with the first question, each activity has five questions.
  const extraQuestions = {
    young: {
      spot: [
        {
          message: 'A pop-up says: “Your tablet has a virus! Tap here now!”',
          question: 'What should you do?',
          options: [
            ['safe', 'Close it and ask a trusted adult for help'],
            ['unsafe', 'Tap the pop-up straight away'],
            ['unsafe', 'Download whatever it tells you to download']
          ],
          correct: 'safe',
          explanation:
            'Scary pop-ups can trick people into clicking. Close them and ask a trusted adult.'
        },
        {
          message: 'A player you just met asks for your school name and class.',
          question: 'What is the safest choice?',
          options: [
            ['safe', 'Keep those details private'],
            ['unsafe', 'Tell them everything so you can be friends'],
            ['unsafe', 'Send a photo of your school ID']
          ],
          correct: 'safe',
          explanation:
            'Keep personal details and school information private when chatting with people online.'
        },
        {
          message: 'A message says you must tell someone your game password to win a prize.',
          question: 'What should you do?',
          options: [
            ['safe', 'Never share the password and tell a trusted adult'],
            ['unsafe', 'Share it just this once'],
            ['unsafe', 'Use your parent’s password instead']
          ],
          correct: 'safe',
          explanation:
            'Passwords are secret. A real prize should not require you to give your password to a stranger.'
        },
        {
          message: 'A stranger online asks you to keep your chat secret from your family.',
          question: 'What is the safest next step?',
          options: [
            ['safe', 'Stop chatting and tell a trusted adult'],
            ['unsafe', 'Promise not to tell anyone'],
            ['unsafe', 'Share more personal information']
          ],
          correct: 'safe',
          explanation:
            'Someone pressuring you to keep an uncomfortable online conversation secret is a warning sign. Ask a trusted adult for help.'
        }
      ],

      scenario: [
        {
          intro: 'A friend sends you a link to a “free prize” page you do not recognise.',
          question: 'What should you do?',
          options: [
            ['safe', 'Do not open it; check with a trusted adult'],
            ['unsafe', 'Open it because your friend sent it'],
            ['unsafe', 'Enter your name and password']
          ],
          explanation:
            'Even messages from friends can contain unsafe links. Check before opening them.'
        },
        {
          intro: 'Someone in a game says they will be angry unless you send them a photo.',
          question: 'What is the safest response?',
          options: [
            ['safe', 'Do not send it and tell a trusted adult'],
            ['unsafe', 'Send the photo so they are not angry'],
            ['unsafe', 'Send a photo with your school uniform']
          ],
          explanation:
            'You never have to send photos because someone pressures you. Get help from a trusted adult.'
        },
        {
          intro: 'A classmate is being teased in an online game chat.',
          question: 'What would be the kindest safe choice?',
          options: [
            ['safe', 'Do not join in; support them and report the teasing'],
            ['unsafe', 'Join in so the group likes you'],
            ['unsafe', 'Share the teasing with more people']
          ],
          explanation:
            'Do not join cyberbullying. Support the person and ask an adult for help when needed.'
        },
        {
          intro: 'A website asks you to enter your home address to play a simple game.',
          question: 'What should you do?',
          options: [
            ['safe', 'Leave the page and ask a trusted adult'],
            ['unsafe', 'Enter your full address'],
            ['unsafe', 'Use your family member’s address']
          ],
          explanation:
            'A simple game should not need your home address. Keep it private and ask for help.'
        }
      ]
    },

    middle: {
      spot: [
        {
          message: '“Your account will be deleted in 10 minutes. Verify here: example-login-prize.test”',
          question: 'What is the safest response?',
          options: [
            ['safe', 'Open the official app separately to check your account'],
            ['unsafe', 'Use the message link before time runs out'],
            ['unsafe', 'Reply with your password']
          ],
          correct: 'safe',
          explanation:
            'Threats and countdowns create pressure. Check your account using the official app or website, not the message link.'
        },
        {
          message: 'A social media account promises followers if you provide your login code.',
          question: 'What should you do?',
          options: [
            ['safe', 'Keep the code private and report the account'],
            ['unsafe', 'Send the code to get more followers'],
            ['unsafe', 'Post the code in a comment']
          ],
          correct: 'safe',
          explanation:
            'Login codes and OTPs can let someone access your account. Never share them.'
        },
        {
          message: 'An online store offers an expensive phone for almost no money and asks for immediate payment.',
          question: 'What should you check first?',
          options: [
            ['safe', 'Verify the seller independently and discuss it with a trusted adult'],
            ['unsafe', 'Pay immediately before the deal ends'],
            ['unsafe', 'Send payment details through the chat']
          ],
          correct: 'safe',
          explanation:
            'Unrealistic prices and pressure to pay quickly are common scam warning signs.'
        },
        {
          message: 'A file from an unknown account is named “FreeGameRewards.exe”.',
          question: 'What is the safest choice?',
          options: [
            ['safe', 'Do not download or run it; report the message'],
            ['unsafe', 'Open it to see what it does'],
            ['unsafe', 'Forward it to classmates']
          ],
          correct: 'safe',
          explanation:
            'Unexpected files can be harmful. Do not run them just because they promise rewards.'
        }
      ],

      scenario: [
        {
          intro: 'A classmate asks you to forward a rumour about another student.',
          question: 'What would you do?',
          options: [
            ['safe', 'Do not forward it and avoid spreading unverified claims'],
            ['unsafe', 'Forward it to make the chat more exciting'],
            ['unsafe', 'Add the student’s private details']
          ],
          explanation:
            'Forwarding rumours can harm people. Do not spread unverified or private information.'
        },
        {
          intro: 'A gaming friend asks for your one-time login code to “help fix” your account.',
          question: 'What is the safest action?',
          options: [
            ['safe', 'Do not share it; check account help through the official service'],
            ['unsafe', 'Send the code because you trust them'],
            ['unsafe', 'Send both the code and password']
          ],
          explanation:
            'A one-time code can give access to your account. Keep it secret, even from online friends.'
        },
        {
          intro: 'Someone posts an insulting comment about you repeatedly.',
          question: 'What should you do?',
          options: [
            ['safe', 'Save relevant evidence, block or report, and tell a trusted adult'],
            ['unsafe', 'Share their private information in revenge'],
            ['unsafe', 'Encourage everyone to insult them back']
          ],
          explanation:
            'Avoid retaliation. Save evidence safely, report the abuse, and ask a trusted adult for support.'
        },
        {
          intro: 'A message that looks like it is from your school asks you to log in through an unfamiliar link.',
          question: 'What is the best next step?',
          options: [
            ['safe', 'Contact the school through a known official channel'],
            ['unsafe', 'Enter your school account password'],
            ['unsafe', 'Send the link and password to classmates']
          ],
          explanation:
            'Verify unexpected school requests independently instead of trusting an unfamiliar link.'
        }
      ]
    },

    older: {
      spot: [
        {
          message: 'An email from “support” asks you to open an attachment to avoid a fine.',
          question: 'What is the safest first step?',
          options: [
            ['safe', 'Do not open it; verify with the organisation using official contact details'],
            ['unsafe', 'Open it to read the fine details'],
            ['unsafe', 'Reply with account information']
          ],
          correct: 'safe',
          explanation:
            'Unexpected attachments and threats are warning signs. Verify the message independently.'
        },
        {
          message: 'A website address uses a misspelled version of a familiar brand name.',
          question: 'What should you do?',
          options: [
            ['safe', 'Avoid entering information and navigate to the known official site'],
            ['unsafe', 'Log in because the logo looks correct'],
            ['unsafe', 'Use the same password to test it']
          ],
          correct: 'safe',
          explanation:
            'Scam sites can copy logos. Carefully check the domain and use the official address directly.'
        },
        {
          message: 'A caller claims to be technical support and asks you to install remote-access software.',
          question: 'What is the safest response?',
          options: [
            ['safe', 'End the call and contact the company through its official website'],
            ['unsafe', 'Install it and give them access'],
            ['unsafe', 'Share your login and OTP to prove your identity']
          ],
          correct: 'safe',
          explanation:
            'Unsolicited remote-access requests can give strangers control of your device. Verify independently.'
        },
        {
          message: 'A job or scholarship message guarantees acceptance but demands a processing fee immediately.',
          question: 'How should you respond?',
          options: [
            ['safe', 'Verify the opportunity through official channels before paying anything'],
            ['unsafe', 'Pay quickly so you do not lose the offer'],
            ['unsafe', 'Send identity documents to the unknown sender']
          ],
          correct: 'safe',
          explanation:
            'Guaranteed outcomes and urgent fees can indicate fraud. Verify the organisation and process independently.'
        }
      ],

      scenario: [
        {
          intro: 'A friend’s account messages you asking for urgent money, but the wording seems unusual.',
          question: 'What should you do?',
          options: [
            ['safe', 'Call or contact your friend using a separate known channel'],
            ['unsafe', 'Send money immediately'],
            ['unsafe', 'Ask for bank details and pay without verification']
          ],
          explanation:
            'Accounts can be compromised. Confirm unusual requests through a separate trusted channel.'
        },
        {
          intro: 'A website offers a scholarship but requests your password and OTP.',
          question: 'What is the safest choice?',
          options: [
            ['safe', 'Do not provide them; verify the scholarship on an official site'],
            ['unsafe', 'Share both to complete the application'],
            ['unsafe', 'Send the details to the contact listed in the message']
          ],
          explanation:
            'Legitimate applications should not need your account password or OTP. Verify through official channels.'
        },
        {
          intro: 'You notice a social account impersonating a teacher and asking students for money.',
          question: 'What should you do?',
          options: [
            ['safe', 'Verify with the teacher or school and report the impersonating account'],
            ['unsafe', 'Pay because the profile photo looks real'],
            ['unsafe', 'Share the payment request as if it were confirmed']
          ],
          explanation:
            'Names and photos can be copied. Verify independently and alert the school.'
        },
        {
          intro: 'A suspicious message contains a link and an attached document asking you to enable macros.',
          question: 'What is the safest action?',
          options: [
            ['safe', 'Do not open or enable anything; report it through the appropriate channel'],
            ['unsafe', 'Enable macros to read the document'],
            ['unsafe', 'Forward the attachment to friends to test it']
          ],
          explanation:
            'Unexpected files and requests to enable macros can be dangerous. Do not open them; report the message.'
        }
      ]
    }
  };

  function getSelectedAgeContent() {
    // Shared toolkit copy; the activities themselves mix questions from all levels.
    return ageContent.middle;
  }

  const panels = {
    detector: {
      title: 'Phishing Detector',
      html: `
        <div class="message-example">
          <strong>🚧 Detector coming soon</strong>
          The phishing scanner is not connected yet. This website does not currently analyse real messages or links.
        </div>
        <h3>What you can check right now</h3>
        <ul>
          <li>Look for urgent demands, threats, or unexpected prizes.</li>
          <li>Check the sender and the full website address.</li>
          <li>Never share your password, PIN, or OTP in response to a message.</li>
          <li>Verify unexpected requests through an official, independent channel.</li>
        </ul>
        <p>Practise with fictional examples. Never enter real passwords or OTPs into a training activity.</p>
      `
    },

    toolkit: {
      title: 'Cyber Safety Toolkit',
      html: ''
    }
  };

  const guides = {
    passwords: {
      title: 'Passwords & accounts',
      body: `
        <ul>
          <li>Use long, unique passwords for different accounts.</li>
          <li>Never share passwords, PINs, or OTPs with another person.</li>
          <li>Enable multifactor authentication when available.</li>
          <li>If you suspect account theft, tell a trusted adult if needed and change your password through the official service.</li>
        </ul>
      `
    },

    privacy: {
      title: 'Privacy & personal information',
      body: `
        <ul>
          <li>Think before sharing your address, phone number, school, location, or daily routine.</li>
          <li>Review who can see your posts and profile.</li>
          <li>Be cautious with unknown friend requests and online contacts.</li>
          <li>Remember that screenshots and shared posts can persist after deletion.</li>
        </ul>
      `
    },

    kindness: {
      title: 'Cyberbullying & kindness',
      body: `
        <ul>
          <li>Do not retaliate or forward hurtful content.</li>
          <li>Block and report abusive accounts when appropriate.</li>
          <li>Tell a trusted adult, teacher, or school counsellor.</li>
          <li>Support someone being targeted without spreading their private information.</li>
        </ul>
      `
    },

    links: {
      title: 'Clicked a suspicious link?',
      body: `
        <ul>
          <li>Close the page and do not enter more information.</li>
          <li>If you entered a password, change it through the official service.</li>
          <li>If you shared banking details or an OTP, contact a trusted adult and the relevant bank or service immediately.</li>
          <li>Do not open unexpected downloaded files. Ask for help checking the device.</li>
          <li>In India, visit the <a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer">National Cyber Crime Portal</a> for reporting guidance.</li>
        </ul>
      `
    }
  };

  function showPanel(title, html) {
    panelTitle.textContent = title;
    panelContent.innerHTML = html;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');

    if (backdrop) {
      backdrop.classList.add('show');
    }

    document.body.style.overflow = 'hidden';
  }

  function hidePanel() {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');

    if (backdrop) {
      backdrop.classList.remove('show');
    }

    document.body.style.overflow = '';
  }

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2600);
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  }

  function shuffleArray(items) {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function getQuestionSet(type) {
    // Build one shared pool from younger, middle, and older student content.
    const allQuestions = Object.keys(ageContent).flatMap(age => {
      const content = ageContent[age];
      const firstQuestion = type === 'spot'
        ? {
            message: content.spotMessage,
            question: content.spotQuestion,
            options: content.spotOptions,
            correct: content.spotCorrect,
            explanation: content.spotExplanation
          }
        : {
            intro: content.scenarioIntro,
            question: 'What is the safest choice?',
            options: content.scenarioOptions,
            correct: 'safe',
            explanation: content.scenarioExplanation
          };

      const additional = extraQuestions[age][type].map(question => ({
        ...question,
        correct: question.correct || 'safe'
      }));

      return [firstQuestion, ...additional];
    });

    // Shuffle both the question order and each question's answer choices each time an activity starts.
    return shuffleArray(allQuestions).map(question => ({
      ...question,
      options: shuffleArray(question.options)
    }));
  }

  function renderActivityQuestion() {
    if (!activityState) return;

    const { type, questions, index, score } = activityState;
    const question = questions[index];
    const isSpot = type === 'spot';
    const progress = index + 1;

    const title = isSpot
      ? 'Spot the Scam'
      : 'What Would You Do?';

    const options = question.options.map(([value, label]) => `
      <button class="answer-button" data-activity-answer="${value}">
        ${escapeHTML(label)}
      </button>
    `).join('');

    showPanel(title, `
      <div class="activity-progress" style="margin-bottom:18px;">
        <div style="display:flex;justify-content:space-between;gap:12px;margin-bottom:8px;">
          <strong>Question ${progress} of ${questions.length}</strong>
          <span>Score: <strong id="activityScore">${score}</strong></span>
        </div>
        <div style="height:8px;background:#e8eaf2;border-radius:99px;overflow:hidden;">
          <div style="height:100%;width:${(progress / questions.length) * 100}%;background:#635bdb;border-radius:99px;"></div>
        </div>
      </div>
      <section class="question-block" aria-labelledby="activityQuestionTitle">
        ${isSpot
          ? `<div class="message-example"><strong>Example message</strong><span>${escapeHTML(question.message || '')}</span></div>`
          : `<div class="scenario-intro"><strong>Scenario</strong><span>${escapeHTML(question.intro || '')}</span></div>`}
        <div class="question-prompt">
          <div class="question-kicker">YOUR CHOICE</div>
          <h3 id="activityQuestionTitle">${escapeHTML(question.question)}</h3>
          <p class="question-instruction">Choose the safest response below.</p>
        </div>
        <div class="answer-list">${options}</div>
      </section>
      <div id="activityFeedback" aria-live="polite"></div>
      <div id="activityControls" style="margin-top:16px;"></div>
    `);
  }

  function showSpotActivity() {
    activityState = {
      type: 'spot',
      questions: getQuestionSet('spot'),
      index: 0,
      score: 0,
      answered: false
    };

    renderActivityQuestion();
  }

  function showScenarioActivity() {
    activityState = {
      type: 'scenario',
      questions: getQuestionSet('scenario'),
      index: 0,
      score: 0,
      answered: false
    };

    renderActivityQuestion();
  }

  function showActivityResults() {
    if (!activityState) return;

    const { type, questions, score } = activityState;
    const total = questions.length;
    const percentage = Math.round((score / total) * 100);

    const message = percentage === 100
      ? 'Excellent work! You spotted every safe choice.'
      : percentage >= 60
        ? 'Good effort! Review the explanations to strengthen your cyber-safety skills.'
        : 'Keep practising! Learning to pause, check, and ask for help makes a difference.';

    const title = type === 'spot'
      ? 'Spot the Scam: Results'
      : 'What Would You Do?: Results';

    showPanel(title, `
      <div class="activity-results" style="text-align:center;padding:18px 0;">
        <div class="result-trophy" style="font-size:36px;margin-bottom:14px;">
          ${percentage >= 60 ? '🏆' : '🛡️'}
        </div>
        <div class="result-score-number" data-final-score="${score}">0</div>
        <div class="result-score-label" style="margin:4px 0 10px;">out of ${total} correct</div>
        <p style="margin:0 0 18px;">${percentage}% correct</p>
        <div style="height:10px;background:rgba(255,255,255,.10);border-radius:99px;overflow:hidden;max-width:360px;margin:0 auto 18px;">
          <div class="result-meter" style="height:100%;width:${percentage}%;background:${percentage >= 60 ? 'linear-gradient(90deg,#23C987,#69F0B2)' : 'linear-gradient(90deg,#F04462,#FF8293)'};border-radius:99px;"></div>
        </div>
        <p>${message}</p>
        <button class="answer-button results-retry-button" data-restart-activity="${type}" style="margin-top:12px;">
          Try again
        </button>
      </div>
    `);

    const scoreNumber = document.querySelector('[data-final-score]');
    if (scoreNumber) {
      const targetScore = Number(scoreNumber.dataset.finalScore || 0);
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) {
        scoreNumber.textContent = String(targetScore);
      } else {
        const duration = 850;
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          scoreNumber.textContent = String(Math.round(targetScore * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }
  }

  function showToolkit() {
    const content = getSelectedAgeContent();

    const extra = content.toolkitExtra.map(item =>
      `<li>${escapeHTML(item)}</li>`
    ).join('');

    showPanel('Cyber Safety Toolkit', `
      <p>${content.toolkitIntro}</p>
      <ul>${extra}</ul>
      <h3>Explore a quick guide</h3>
      <div class="answer-list">
        <button class="answer-button" data-guide="passwords">Passwords & accounts</button>
        <button class="answer-button" data-guide="privacy">Privacy & personal information</button>
        <button class="answer-button" data-guide="kindness">Cyberbullying & kindness</button>
        <button class="answer-button" data-guide="links">Clicked a suspicious link?</button>
      </div>
    `);
  }

  function showGuide(key) {
    const guide = guides[key];
    if (!guide) return;

    showPanel(guide.title, `
      <button class="guide-back-button" type="button" data-back-to-toolkit>
        <span class="arrow-mark arrow-left" aria-hidden="true">←</span>
        <span>Back to toolkit</span>
      </button>
      <p>Here are some practical steps to remember.</p>
      ${guide.body}
      <p><strong>If you feel unsafe, ask a trusted adult for help.</strong></p>
    `);
  }

  document.addEventListener('click', event => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const openButton = target.closest('[data-open]');

    if (openButton) {
      const key = openButton.dataset.open;

      if (key === 'spot') {
        showSpotActivity();
      } else if (key === 'scenario') {
        showScenarioActivity();
      } else if (key === 'toolkit') {
        showToolkit();
      } else if (panels[key]) {
        showPanel(panels[key].title, panels[key].html);
      }

      return;
    }

    const restartButton = target.closest('[data-restart-activity]');

    if (restartButton) {
      if (restartButton.dataset.restartActivity === 'spot') {
        showSpotActivity();
      } else {
        showScenarioActivity();
      }

      return;
    }

    const nextButton = target.closest('[data-next-question]');

    if (nextButton) {
      if (!activityState) return;

      if (activityState.index < activityState.questions.length - 1) {
        activityState.index += 1;
        activityState.answered = false;
        renderActivityQuestion();
      } else {
        showActivityResults();
      }

      return;
    }

    const activityAnswer = target.closest('[data-activity-answer]');

    if (activityAnswer && activityState && !activityState.answered) {
      const question = activityState.questions[activityState.index];
      const selectedValue = activityAnswer.dataset.activityAnswer;
      const correct = selectedValue === question.correct;
      const answerList = activityAnswer.closest('.answer-list');
      const feedback = document.getElementById('activityFeedback');
      const controls = document.getElementById('activityControls');

      activityState.answered = true;

      if (correct) {
        activityState.score += 1;
      }

      if (answerList) {
        answerList.querySelectorAll('[data-activity-answer]').forEach(button => {
          const isCorrectAnswer =
            button.dataset.activityAnswer === question.correct;
          const isSelectedAnswer = button === activityAnswer;

          button.disabled = true;

          if (isSelectedAnswer && !correct) {
            // The student's incorrect selection is red.
            button.style.setProperty(
              'background-color',
              'rgba(127, 29, 45, 0.88)',
              'important'
            );
            button.style.setProperty(
              'border-color',
              '#FF5268',
              'important'
            );
            button.style.setProperty('color', '#FFF1F3', 'important');
          } else if (isCorrectAnswer) {
            // Show the correct answer in green.
            button.style.setProperty(
              'background-color',
              'rgba(20, 92, 67, 0.88)',
              'important'
            );
            button.style.setProperty(
              'border-color',
              '#42E59B',
              'important'
            );
            button.style.setProperty('color', '#E9FFF4', 'important');
          } else {
            // Other unselected, incorrect options remain neutral.
            button.style.setProperty(
              'background-color',
              'rgba(255, 255, 255, 0.07)',
              'important'
            );
            button.style.setProperty(
              'border-color',
              'rgba(226, 211, 255, 0.24)',
              'important'
            );
            button.style.setProperty('color', '#F4EEFF', 'important');
          }
        });
      }

      if (feedback) {
        feedback.className = correct ? 'feedback correct' : 'feedback wrong';
        feedback.textContent = correct
          ? question.explanation
          : `Not quite. ${question.explanation}`;

        feedback.style.setProperty(
          'background-color',
          correct ? 'rgba(20, 92, 67, 0.88)' : 'rgba(127, 29, 45, 0.88)',
          'important'
        );
        feedback.style.setProperty(
          'border-color',
          correct ? '#42E59B' : '#FF5268',
          'important'
        );
        feedback.style.setProperty(
          'color',
          correct ? '#E9FFF4' : '#FFF1F3',
          'important'
        );
        feedback.style.padding = '16px';
        feedback.style.marginTop = '16px';
        feedback.style.borderWidth = '1px';
        feedback.style.borderStyle = 'solid';
        feedback.style.borderRadius = '12px';
        feedback.style.lineHeight = '1.7';
      }

      const scoreDisplay = document.getElementById('activityScore');

      if (scoreDisplay) {
        scoreDisplay.textContent = String(activityState.score);
        scoreDisplay.classList.remove('score-pop');
        void scoreDisplay.offsetWidth;
        scoreDisplay.classList.add('score-pop');
      }

      if (controls) {
        const isLast =
          activityState.index === activityState.questions.length - 1;

        controls.innerHTML = `
          <button
            class="answer-button"
            data-next-question="true"
            style="background:#635bdb;color:#ffffff;border-color:#635bdb;"
          >
            ${isLast ? 'View results' : 'Next question'} <span class="arrow-mark arrow-right" aria-hidden="true">→</span>
          </button>
        `;
      }

      return;
    }

    const backToToolkitButton = target.closest('[data-back-to-toolkit]');

    if (backToToolkitButton) {
      showToolkit();
      return;
    }

    const guideButton = target.closest('[data-guide]');

    if (guideButton) {
      const key = guideButton.dataset.guide;

      if (key === 'toolkit') {
        showToolkit();
      } else {
        showGuide(key);
      }

      return;
    }
  });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (closePanel) {
    closePanel.addEventListener('click', hidePanel);
  }

  if (backdrop) {
    backdrop.addEventListener('click', hidePanel);
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      hidePanel();
    }
  });


  console.log('CyberSmart loaded successfully. No account or sign-in required.');
});
