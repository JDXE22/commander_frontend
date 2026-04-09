import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import buddyLogo from '../../assets/buddy.svg';
import './Hero.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const mockupVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.6,
    },
  },
};

export const Hero = () => {
  return (
    <div className='hero-page'>
      <nav className='hero-navbar'>
        <div className='logo-group'>
          <img src={buddyLogo} alt='Commander Logo' className='logo-icon-img' />
          <span className='navbar-brand-text'>COMMANDER</span>
        </div>
        <div className='hero-nav-links'>
          <Link to='/auth' className='btn-signin-outline'>
            Sign In
          </Link>
        </div>
      </nav>

      <div className='hero-content'>
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='hero-text-group'>
          <motion.div variants={itemVariants} className='hero-brand-supertitle'>
            <span className='prompt-sign'>$</span>
            <span className='brand-text'>COMMANDER</span>
            <span className='terminal-cursor'></span>
          </motion.div>
          <motion.h1 variants={itemVariants} className='hero-title'>
            COMMAND YOUR WORKFLOW
          </motion.h1>
          <motion.p variants={itemVariants} className='hero-subtitle'>
            The ultimate command center for modern professionals. Organize,
            filter, and execute with terminal-grade precision.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link to='/terminal' className='btn-cta'>
              <span className='btn-prompt'>$</span> Try it out
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          variants={mockupVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          className='hero-mockup'>
          <div className='mockup-header'>
            <div className='mockup-dots'>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className='mockup-title'>Terminal View</div>
          </div>
          <div className='mockup-body'>
            <div className='mockup-sidebar'>
              <div className='side-item active'></div>
              <div className='side-item'></div>
              <div className='side-item'></div>
            </div>
            <div className='mockup-main'>
              <div className='mockup-search'>
                <div className='mockup-prompt'>$ /h1 </div>
              </div>
              <div className='mockup-card'>
                <div className='mockup-line-sm'></div>
                <div className='mockup-line-lg'></div>
              </div>
              <div className='mockup-card'>
                <div className='mockup-line-sm'></div>
                <div className='mockup-line-lg'></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <section className='hero-section alt-bg'>
        <div className='section-container'>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='section-info'>
            <h2 className='section-title'>Filter with Precision</h2>
            <p className='section-text'>
              Easily manage and locate your command macros. Use our advanced
              filtering to stay organized and find exactly what you need in
              seconds.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='hero-mockup high-def'>
            <div className='mockup-header'>
              <div className='mockup-dots'>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className='mockup-title'>Filter View</div>
            </div>
            <div className='mockup-body'>
              <div className='mockup-sidebar'>
                <div className='side-item'></div>
                <div className='side-item active'></div>
                <div className='side-item'></div>
              </div>
              <div className='mockup-main'>
                <div className='mockup-header-row'>
                  <div className='mockup-line-md'></div>
                </div>
                <div className='mockup-card filter-card'>
                  <div className='mockup-card-header'>
                    <span className='mockup-badge'>/hi1</span>
                    <div className='mockup-btns'>
                      <div className='mockup-btn-sm'></div>
                      <div className='mockup-btn-sm green'></div>
                    </div>
                  </div>
                  <div className='mockup-text-area'>
                    Hello, how can I help you today?
                  </div>
                </div>
                <div className='mockup-card filter-card'>
                  <div className='mockup-card-header'>
                    <span className='mockup-badge'>/bye1</span>
                    <div className='mockup-btns'>
                      <div className='mockup-btn-sm'></div>
                      <div className='mockup-btn-sm green'></div>
                    </div>
                  </div>
                  <div className='mockup-text-area'>
                    Goodbye, see you next time!
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className='hero-section'>
        <div className='section-container rev'>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='section-info'>
            <h2 className='section-title'>Create Seamlessly</h2>
            <p className='section-text'>
              Building new commands has never been easier. Our intuitive
              interface guides you through creating powerful macros with custom
              triggers and responses.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='hero-mockup high-def'>
            <div className='mockup-header'>
              <div className='mockup-dots'>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className='mockup-title'>Create View</div>
            </div>
            <div className='mockup-body'>
              <div className='mockup-sidebar'>
                <div className='side-item'></div>
                <div className='side-item'></div>
                <div className='side-item active'></div>
              </div>
              <div className='mockup-main centered'>
                <div className='mockup-create-card'>
                  <div className='mockup-field'>
                    <div className='mockup-label'>COMMAND</div>
                    <div className='mockup-input'>/new-command</div>
                  </div>
                  <div className='mockup-field'>
                    <div className='mockup-label'>NAME</div>
                    <div className='mockup-input'>My Custom Logic</div>
                  </div>
                  <div className='mockup-field'>
                    <div className='mockup-label'>TEXT RESPONSE</div>
                    <div className='mockup-textarea'>
                      Custom macro ready to execute...
                    </div>
                  </div>
                  <div className='mockup-btn-large'>Register Command</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className='hero-footer'>
        <div className='logo-group'>
          <img
            src={buddyLogo}
            alt='Commander Logo'
            className='logo-icon-img'
            style={{ width: '40px', height: '40px' }}
          />
          <span className='logo-text'>Commander</span>
        </div>
        <p>&copy; 2026 Commander App. Built for efficiency.</p>
      </footer>
    </div>
  );
};
