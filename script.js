
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        "primary-dark": "#4338CA",
        secondary: "#06B6D4",
        "secondary-dark": "#0891B2",
        warning: "#F59E0B",
        "warning-dark": "#D97706",
        danger: "#EF4444",
        "danger-dark": "#DC2626",
        success: "#10B981",
        "success-dark": "#059669",
      },
      fontFamily: {
        quicksand: ["Quicksand", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "card-dark":
          "0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)",
      },
    },
  },
};



document.addEventListener('DOMContentLoaded', function() {
  const menuItems = document.querySelectorAll('a[href="#"]');

  menuItems.forEach(item => {
    if (item.querySelector('.fa-chevron-down')) {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        const submenu = this.nextElementSibling;
        if (submenu.style.display === 'none' || submenu.style.display === '') {
          submenu.style.display = 'block';
          this.querySelector('.fa-chevron-down').classList.replace('fa-chevron-down', 'fa-chevron-up');
        } else {
          submenu.style.display = 'none';
          this.querySelector('.fa-chevron-up').classList.replace('fa-chevron-up', 'fa-chevron-down');
        }
      });
    }
  });
});





document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu-item > a');
    
    menuItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        
        const parent = this.parentNode;
        const submenu = parent.querySelector('.submenu');
        const arrow = this.querySelector('.fa-chevron-right');
        
        // Tambahkan efek ripple
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        // Posisikan ripple
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        // Hapus ripple setelah animasi selesai
        setTimeout(() => {
          ripple.remove();
        }, 500);
        
        // Check if submenu is open
        const isOpen = submenu.classList.contains('active');
        
        // Close all other submenus
        document.querySelectorAll('.submenu.active').forEach(menu => {
          if (menu !== submenu) {
            menu.style.maxHeight = '0px';
            menu.classList.remove('active');
            const otherArrow = menu.parentNode.querySelector('.fa-chevron-right');
            otherArrow.style.transform = 'rotate(0deg)';
          }
        });
        
        // Toggle current submenu
        if (isOpen) {
          submenu.style.maxHeight = '0px';
          submenu.classList.remove('active');
          arrow.style.transform = 'rotate(0deg)';
        } else {
          submenu.classList.add('active');
          submenu.style.maxHeight = submenu.scrollHeight + 'px';
          arrow.style.transform = 'rotate(90deg)';
        }
      });
    });
  });



  
document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("themeToggle");
  const html = document.documentElement;

  // Cek tema yang disimpan di localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    html.classList.add(savedTheme);
  }

  // Toggle tema kedua
  themeToggle.addEventListener("click", function () {
    if (html.classList.contains("theme-2")) {
      html.classList.remove("theme-2");
      localStorage.removeItem("theme");
    } else {
      html.classList.add("theme-2");
      localStorage.setItem("theme", "theme-2");
    }
  });
});
      document.addEventListener("DOMContentLoaded", function () {
     // DOM Elements
     const darkModeToggle = document.getElementById("darkModeToggle");
     const html = document.documentElement;
     const toggleSidebar = document.getElementById("toggleSidebar");
     const sidebar = document.getElementById("sidebar");
     const closeSidebar = document.getElementById("closeSidebar");
     const sidebarOverlay = document.getElementById("sidebarOverlay");
     const notificationButton = document.getElementById("notificationButton");
     const notificationPanel = document.getElementById("notificationPanel");
     const alertCards = document.querySelectorAll("#alertContainer > div");
     const alertDetailModal = document.getElementById("alertDetailModal");
     const closeAlertModal = document.getElementById("closeAlertModal");
     const alertSearch = document.getElementById("alertSearch");
     const freezeSearch = document.getElementById("freezeSearch");
     const image = document.getElementById('modeImage');
 
     // Check for saved theme preference or use system preference
     if (
         localStorage.getItem("darkMode") === "true" ||
         (localStorage.getItem("darkMode") === null &&
             window.matchMedia("(prefers-color-scheme: dark)").matches)
     ) {
         html.classList.add("dark");
         image.src = "https://res.cloudinary.com/dwkkbhn4z/image/upload/v1744794668/logoDarkPq-min_fu1qnx.png"; // Gambar untuk mode gelap
     }
 
     // Dark mode toggle
     darkModeToggle.addEventListener("click", function () {
         html.classList.toggle("dark");
         localStorage.setItem("darkMode", html.classList.contains("dark"));
 
         // Mengubah gambar berdasarkan mode
         if (html.classList.contains("dark")) {
             image.src = "https://res.cloudinary.com/dwkkbhn4z/image/upload/v1744794668/logoDarkPq-min_fu1qnx.png"; // Gambar untuk mode gelap
         } else {
             image.src = "https://protectqube.com/wp-content/uploads/2025/01/logo.png"; // Gambar untuk mode terang
         }
     });
 
  

        // Sidebar toggle for mobile
        toggleSidebar.addEventListener("click", function () {
          sidebar.classList.toggle("-translate-x-full");
          sidebarOverlay.classList.toggle("hidden");
        });

        closeSidebar.addEventListener("click", function () {
          sidebar.classList.add("-translate-x-full");
          sidebarOverlay.classList.add("hidden");
        });

        sidebarOverlay.addEventListener("click", function () {
          sidebar.classList.add("-translate-x-full");
          sidebarOverlay.classList.add("hidden");
        });

        // Notification panel toggle
        notificationButton.addEventListener("click", function (e) {
          e.stopPropagation();
          notificationPanel.classList.toggle("hidden");

          // Hide notification badge when notifications are viewed
          document.getElementById("notificationBadge").textContent = "0";
        });

        // Close notification panel when clicking outside
        document.addEventListener("click", function (e) {
          if (
            !notificationPanel.contains(e.target) &&
            e.target !== notificationButton
          ) {
            notificationPanel.classList.add("hidden");
          }
        });

        // Alert cards click handler
        alertCards.forEach((card) => {
          card.addEventListener("click", function () {
            // Get alert details
            const title = this.querySelector("h4").textContent;
            const subtitle = this.querySelector(
              ".text-xs.text-gray-600, .text-xs.text-gray-400"
            ).textContent;
            const alertType = this.querySelector(
              ".text-sm.font-semibold"
            ).textContent;
            const severity = this.querySelector("span").textContent;
            const time =
              this.querySelector(
                ".fas.fa-clock"
              ).nextSibling.textContent.trim();

            // Update modal content
            document.getElementById("alertDetailTitle").textContent = title;
            document.getElementById("alertDetailSubtitle").textContent =
              subtitle;
            document.getElementById("alertDetailType").textContent = alertType;
            document.getElementById("alertDetailSeverity").textContent =
              severity;
            document.getElementById("alertDetailSeverity").className =
              severity === "Critical"
                ? "bg-red-500 text-white px-3 py-1 rounded-md"
                : "bg-yellow-500 text-white px-3 py-1 rounded-md";

            // Format time for the modal
            const currentDate = new Date();
            const timeParts = time.split(" ");
            const minutes = parseInt(timeParts[0]);
            const formattedTime = new Date(
              currentDate.getTime() - minutes * 60000
            )
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })
              .replace(",", "");

            document.getElementById("alertDetailTime").textContent =
              formattedTime;

            // Show modal
            alertDetailModal.classList.remove("hidden");
          });
        });

        // Close alert detail modal
        closeAlertModal.addEventListener("click", function () {
          alertDetailModal.classList.add("hidden");
        });

        // Close modal when clicking outside content
        alertDetailModal.addEventListener("click", function (e) {
          if (e.target === alertDetailModal) {
            alertDetailModal.classList.add("hidden");
          }
        });

        // Search functionality for alerts
        alertSearch.addEventListener("input", function () {
          const searchTerm = this.value.toLowerCase();

          alertCards.forEach((card) => {
            const title = card.querySelector("h4").textContent.toLowerCase();
            const subtitle = card
              .querySelector(".text-xs.text-gray-600, .text-xs.text-gray-400")
              .textContent.toLowerCase();
            const alertType = card
              .querySelector(".text-sm.font-semibold")
              .textContent.toLowerCase();

            if (
              title.includes(searchTerm) ||
              subtitle.includes(searchTerm) ||
              alertType.includes(searchTerm)
            ) {
              card.style.display = "";
            } else {
              card.style.display = "none";
            }
          });
        });

        // Search functionality for freeze alerts
        freezeSearch.addEventListener("input", function () {
          const searchTerm = this.value.toLowerCase();
          const freezeItems = document.querySelectorAll(
            ".lg\\:col-span-1 .border.border-gray-200, .lg\\:col-span-1 .border.border-gray-700"
          );

          freezeItems.forEach((item) => {
            const title = item
              .querySelector(".font-medium")
              .textContent.toLowerCase();
            const content = item.textContent.toLowerCase();

            if (title.includes(searchTerm) || content.includes(searchTerm)) {
              item.style.display = "";
            } else {
              item.style.display = "none";
            }
          });
        });

        // Enable toggle buttons in freeze alerts
        const toggleButtons = document.querySelectorAll(".fas.fa-toggle-off");
        toggleButtons.forEach((button) => {
          button.addEventListener("click", function (e) {
            e.stopPropagation();
            // Toggle class for visual feedback
            this.classList.toggle("fa-toggle-off");
            this.classList.toggle("fa-toggle-on");

            // Find the parent item
            const freezeItem = this.closest(
              ".border.border-gray-200, .border.border-gray-700"
            );

            // Add visual feedback
            freezeItem.classList.add(
              "bg-green-50",
              "dark:bg-green-900",
              "border-green-200",
              "dark:border-green-700"
            );

            // After a delay, remove the item
            setTimeout(() => {
              freezeItem.style.transition = "opacity 0.5s, transform 0.5s";
              freezeItem.style.opacity = "0";
              freezeItem.style.transform = "translateX(100%)";
              setTimeout(() => {
                freezeItem.remove();
              }, 500);
            }, 1000);
          });
        });

        // Initialize counts and update functions
        let alertCount = 15;
        let activeDeviceCount = 802;

        // Function to simulate new alerts
        function simulateNewAlert() {
          // Random chance to add a new alert
          if (Math.random() < 0.3) {
            alertCount++;

            // Update alert count in UI
            document.querySelector(
              ".text-2xl.font-semibold:nth-child(1)"
            ).textContent = alertCount;

            // Update notification badge
            const badge = document.getElementById("notificationBadge");
            badge.textContent = parseInt(badge.textContent) + 1;

            // Add pulsing animation to alert card
            const alertCard = document.querySelector(
              ".flex-shrink-0.bg-red-100.rounded-md.p-3.pulse-animation, .flex-shrink-0.bg-red-100.dark\\:bg-red-900.rounded-md.p-3.pulse-animation"
            );
            alertCard.classList.add("pulse-animation");
          }
        }

        // Function to simulate device status changes
        function simulateDeviceStatusChange() {
          // Random chance to change active device count
          if (Math.random() < 0.2) {
            const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            activeDeviceCount += change;

            // Update active device count in UI
            document.querySelector(
              ".text-2xl.font-semibold:nth-child(1)"
            ).textContent = activeDeviceCount;

            // Update percentage
            const percentElement = document.querySelector(
              ".text-sm.font-semibold.text-green-600, .text-sm.font-semibold.text-green-600.dark\\:text-green-400"
            );
            const percentChange = ((change / activeDeviceCount) * 100).toFixed(
              1
            );
            percentElement.innerHTML = `<i class="fas fa-arrow-${
              change >= 0 ? "up" : "down"
            }"></i><span class="ml-1">${Math.abs(percentChange)}%</span>`;
          }
        }

        // Run simulations periodically
        setInterval(simulateNewAlert, 30000); // Every 30 seconds
        setInterval(simulateDeviceStatusChange, 45000); // Every 45 seconds
      });


      document.addEventListener('DOMContentLoaded', function() {
        // Ambil semua alert cards
        const alertCards = document.querySelectorAll('#alertContainer > div');
        const alertDetailModal = document.getElementById('alertDetailModal');
        const closeAlertModal = document.getElementById('closeAlertModal');
        
        // Tambahkan event listener ke setiap alert card
        alertCards.forEach(card => {
          card.addEventListener('click', function() {
            // Tampilkan modal dengan menghapus class 'hidden'
            alertDetailModal.classList.remove('hidden');
            alertDetailModal.classList.add('visible');
            
            // Opsional: Mengisi data detail alert berdasarkan card yang diklik
            const alertTitle = this.querySelector('h4').textContent;
            const alertLocation = this.querySelector('.text-xs.text-gray-600').textContent;
            const alertType = this.querySelector('.text-sm.font-semibold').textContent;
            
            document.getElementById('alertDetailTitle').textContent = alertTitle;
            document.getElementById('alertDetailSubtitle').textContent = alertLocation;
            document.getElementById('alertDetailType').textContent = alertType;
          });
        });
        
        // Tambahkan event listener untuk tombol close
        closeAlertModal.addEventListener('click', function() {
          // Sembunyikan modal dengan menambahkan class 'hidden'
          alertDetailModal.classList.add('hidden');
          alertDetailModal.classList.remove('visible');
        });
        
        // Tambahkan event listener untuk menutup modal jika user mengklik di luar modal
        alertDetailModal.addEventListener('click', function(event) {
          if (event.target === alertDetailModal) {
            alertDetailModal.classList.add('hidden');
            alertDetailModal.classList.remove('visible');
          }
        });
      });


